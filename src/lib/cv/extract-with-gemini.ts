import { geminiFlash } from "@/lib/gemini";

export type CVData = {
  name: string;
  email?: string | null;
  phone?: string | null;
  skills: string[];
  experienceYears: number;
  currentRole?: string | null;
  education: string;
  summary: string;
};

export async function extractCVData(rawText: string): Promise<CVData> {
  const prompt = `
You are an expert CV parser. Extract structured information from the CV text below.
Return ONLY a valid JSON object — no markdown, no explanation, no code blocks.

CV Text:
"""
${rawText}
"""

Return exactly this JSON shape:
{
  "name": "full name as string",
  "email": "email or null",
  "phone": "phone or null",
  "skills": ["array", "of", "technical and soft skills"],
  "experienceYears": 0,
  "currentRole": "most recent job title or null",
  "education": "highest qualification as a short string",
  "summary": "2-3 sentence professional summary based on the CV"
}
`;

  const result = await geminiFlash.generateContent(prompt);
  const raw = result.response.text().trim();

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned) as CVData;
  } catch {
    throw new Error("AI returned invalid JSON. Try re-uploading the CV.");
  }
}
