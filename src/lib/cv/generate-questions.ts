import { geminiFlash } from "@/lib/gemini";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export async function generateInterviewQuestions(
  cvData: CVData,
  industry: string,
  level: string,
): Promise<string[]> {
  const prompt = `
You are an expert technical interviewer. Generate exactly 9 interview questions for a candidate with the following profile.

Industry / Domain: ${industry}
Experience Level: ${level}
Current Role: ${cvData.currentRole ?? "N/A"}
Experience: ${cvData.experienceYears} years
Skills: ${cvData.skills.join(", ") || "N/A"}
Summary: ${cvData.summary}

Rules:
- Generate exactly 9 questions, ordered from easier/introductory to more advanced.
- Mix of behavioral, technical, and role-specific questions relevant to the candidate's skills and industry.
- Each question should be answerable within 1 minute.
- Return ONLY a valid JSON array of 9 strings — no markdown, no explanation, no code blocks.
`;

  const result = await geminiFlash.generateContent(prompt);
  const raw = result.response.text().trim();

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as string[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid questions array");
    }
    return parsed.slice(0, 9);
  } catch (error) {
    console.error("Failed to parse interview questions:", error);
    throw new Error("AI returned invalid JSON while generating questions.");
  }
}
