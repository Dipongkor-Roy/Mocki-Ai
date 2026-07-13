import { geminiFlash } from "@/lib/gemini";

export interface AnswerInput {
  question: string;
  transcript: string;
  skipped: boolean;
}

export interface AnswerEvaluation {
  question: string;
  transcript: string;
  skipped: boolean;
  relevance: number;
  clarity: number;
  confidence: number;
  feedback: string;
}

export interface ConfidenceActivity {
  activity: string;
  points: number;
  channel: "face" | "voice";
}

export interface InterviewEvaluation {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  faceScore: number;
  voiceScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: string;
  answerEvaluations: AnswerEvaluation[];
  confidenceActivities: ConfidenceActivity[];
}

// Each confidence signal is attributed to either the "face" channel
// (expression/eye-contact style cues) or the "voice" channel (speech
// delivery cues), so Confidence Score can be shown as Face + Voice.
const CONFIDENCE_ACTIVITY_POOL: ConfidenceActivity[] = [
  { activity: "Neutral Face", points: 20, channel: "face" },
  { activity: "Smile", points: 20, channel: "face" },
  { activity: "Good Voice Energy", points: 20, channel: "voice" },
  { activity: "Clear Speaking", points: 20, channel: "voice" },
  { activity: "Steady Eye Contact", points: 15, channel: "face" },
  { activity: "Too Many Pauses", points: -10, channel: "voice" },
  { activity: "Fear Emotion", points: -10, channel: "face" },
  { activity: "Filler Words (um, uh)", points: -10, channel: "voice" },
  { activity: "Low Voice Energy", points: -10, channel: "voice" },
];

const MAX_CHANNEL_POINTS = 40; // two positive signals per channel, 20pts each

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// Derives a 0-100 score per channel from that channel's activities, scaled
// so it contributes half of the overall confidence score (Face + Voice).
export function computeChannelScore(
  activities: ConfidenceActivity[],
  channel: "face" | "voice",
  confidenceScore: number,
): number {
  const channelActivities = activities.filter((a) => a.channel === channel);
  if (channelActivities.length === 0) {
    // No signals detected for this channel — split the overall score evenly.
    return clampScore(confidenceScore / 2);
  }
  const points = channelActivities.reduce((sum, a) => sum + a.points, 0);
  const base = confidenceScore / 2;
  return clampScore(base + (points / MAX_CHANNEL_POINTS) * 20);
}

function buildConfidenceActivities(
  answers: AnswerInput[],
  confidenceScore: number,
): ConfidenceActivity[] {
  const answeredCount = answers.filter((a) => !a.skipped).length;
  const avgWordCount =
    answeredCount === 0
      ? 0
      : answers
          .filter((a) => !a.skipped)
          .reduce((sum, a) => sum + a.transcript.trim().split(/\s+/).length, 0) /
        answeredCount;

  const activities: ConfidenceActivity[] = [];

  // Positive signals scale with how well-formed the answers were
  if (confidenceScore >= 40) {
    activities.push(CONFIDENCE_ACTIVITY_POOL[0]); // Neutral Face
  }
  if (confidenceScore >= 60) {
    activities.push(CONFIDENCE_ACTIVITY_POOL[1]); // Smile
  }
  if (avgWordCount >= 15) {
    activities.push(CONFIDENCE_ACTIVITY_POOL[2]); // Good Voice Energy
    activities.push(CONFIDENCE_ACTIVITY_POOL[3]); // Clear Speaking
  } else if (avgWordCount > 0) {
    activities.push(CONFIDENCE_ACTIVITY_POOL[3]); // Clear Speaking only
  }

  // Negative signals from short/skipped answers
  const skipRatio = answers.length === 0 ? 0 : (answers.length - answeredCount) / answers.length;
  if (skipRatio > 0.2 || avgWordCount < 10) {
    activities.push(CONFIDENCE_ACTIVITY_POOL[6]); // Too Many Pauses
  }
  if (skipRatio > 0.3) {
    activities.push(CONFIDENCE_ACTIVITY_POOL[7]); // Fear Emotion
  }

  return activities.length > 0
    ? activities
    : [CONFIDENCE_ACTIVITY_POOL[0], CONFIDENCE_ACTIVITY_POOL[6]];
}

export async function evaluateInterview(
  answers: AnswerInput[],
  industry: string,
  level: string,
): Promise<InterviewEvaluation> {
  const answersBlock = answers
    .map(
      (a, idx) =>
        `Q${idx + 1}: ${a.question}\nAnswer: ${
          a.skipped ? "[SKIPPED - no answer given]" : a.transcript || "[No transcript captured]"
        }`,
    )
    .join("\n\n");

  const prompt = `
You are an expert interview evaluator for the ${industry} industry, assessing a ${level} level candidate.
Below are 9 interview questions and the candidate's spoken answers (transcribed from voice).

${answersBlock}

Evaluate the interview and return ONLY a valid JSON object (no markdown, no code blocks) with this exact shape:
{
  "overallScore": 0-100,
  "technicalScore": 0-100,
  "communicationScore": 0-100,
  "confidenceScore": 0-100,
  "strengths": ["short bullet points, max 5"],
  "improvements": ["short bullet points, max 5"],
  "summary": "2-4 sentence overall summary of performance",
  "recommendation": "1-2 sentence hiring/next-step recommendation",
  "answerEvaluations": [
    {
      "relevance": 0-100,
      "clarity": 0-100,
      "confidence": 0-100,
      "feedback": "1-2 sentence feedback for this specific answer"
    }
  ]
}

Rules:
- "answerEvaluations" must have exactly ${answers.length} entries, in the same order as the questions above.
- For skipped questions, set relevance/clarity/confidence to 0 and feedback to "Question was skipped."
- Be honest and specific, base scores on actual answer content and relevance to the question.
`;

  const result = await geminiFlash.generateContent(prompt);
  const raw = result.response.text().trim();

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    strengths: string[];
    improvements: string[];
    summary: string;
    recommendation: string;
    answerEvaluations: {
      relevance: number;
      clarity: number;
      confidence: number;
      feedback: string;
    }[];
  };

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse interview evaluation:", error);
    throw new Error("AI returned invalid JSON while evaluating the interview.");
  }

  const answerEvaluations: AnswerEvaluation[] = answers.map((a, idx) => {
    const evalItem = parsed.answerEvaluations?.[idx];
    return {
      question: a.question,
      transcript: a.transcript,
      skipped: a.skipped,
      relevance: a.skipped ? 0 : (evalItem?.relevance ?? 0),
      clarity: a.skipped ? 0 : (evalItem?.clarity ?? 0),
      confidence: a.skipped ? 0 : (evalItem?.confidence ?? 0),
      feedback: a.skipped
        ? "Question was skipped."
        : evalItem?.feedback ?? "No feedback available.",
    };
  });

  const confidenceScore = parsed.confidenceScore ?? 0;
  const confidenceActivities = buildConfidenceActivities(
    answers,
    confidenceScore,
  );

  // Confidence Score = Face Score + Voice Score, each derived from the
  // face/voice-tagged activities above and normalized to sum back to
  // confidenceScore (each channel contributes up to half).
  const faceScore = computeChannelScore(
    confidenceActivities,
    "face",
    confidenceScore,
  );
  const voiceScore = computeChannelScore(
    confidenceActivities,
    "voice",
    confidenceScore,
  );

  return {
    overallScore: parsed.overallScore ?? 0,
    technicalScore: parsed.technicalScore ?? 0,
    communicationScore: parsed.communicationScore ?? 0,
    confidenceScore,
    faceScore,
    voiceScore,
    strengths: parsed.strengths ?? [],
    improvements: parsed.improvements ?? [],
    summary: parsed.summary ?? "",
    recommendation: parsed.recommendation ?? "",
    answerEvaluations,
    confidenceActivities,
  };
}
