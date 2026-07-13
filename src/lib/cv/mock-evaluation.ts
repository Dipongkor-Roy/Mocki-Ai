import type { InterviewEvaluation } from "./evaluate-interview";

// Dev-only sample data so the report UI (and PDF export) can be tested
// without repeatedly running a real interview through Gemini.
export const mockInterviewEvaluation: InterviewEvaluation = {
  overallScore: 78,
  technicalScore: 74,
  communicationScore: 82,
  confidenceScore: 76,
  faceScore: 40,
  voiceScore: 36,
  strengths: [
    "Clear and structured explanations of past project work",
    "Good grasp of core technical fundamentals",
    "Maintained a calm, confident tone throughout",
  ],
  improvements: [
    "Provide more concrete metrics/results when describing achievements",
    "Slow down slightly on technical deep-dive answers",
    "Ask clarifying questions before jumping into an answer",
  ],
  summary:
    "The candidate demonstrated solid technical knowledge and communicated ideas clearly across most questions. Answers were generally well-structured, though a few responses lacked quantifiable impact. Overall a strong, above-average performance.",
  recommendation:
    "Recommended to proceed to the next interview round, with a focus on probing deeper into system design trade-offs.",
  answerEvaluations: [
    {
      question: "Tell me about a challenging project you worked on.",
      transcript:
        "I led the migration of our monolithic backend to a microservices architecture, coordinating with three teams over two months.",
      skipped: false,
      relevance: 85,
      clarity: 80,
      confidence: 78,
      feedback:
        "Good structure, but could include specific metrics (e.g. latency improvement, downtime reduction).",
    },
    {
      question: "How do you handle conflicting priorities?",
      transcript:
        "I usually align with stakeholders on impact and urgency, then communicate trade-offs clearly.",
      skipped: false,
      relevance: 75,
      clarity: 78,
      confidence: 80,
      feedback: "Solid general approach; a concrete example would strengthen this answer.",
    },
    {
      question: "Explain the difference between SQL and NoSQL databases.",
      transcript: "",
      skipped: true,
      relevance: 0,
      clarity: 0,
      confidence: 0,
      feedback: "Question was skipped.",
    },
  ],
  confidenceActivities: [
    { activity: "Maintained steady eye contact", points: 18, channel: "face" },
    { activity: "Used filler words occasionally", points: -5, channel: "voice" },
    { activity: "Spoke with a calm, even pace", points: 15, channel: "voice" },
    { activity: "Paused briefly before answering", points: 8, channel: "face" },
  ],
};
