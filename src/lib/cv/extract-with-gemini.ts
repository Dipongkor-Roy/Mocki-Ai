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
  industry?: string | null;
  jobTitles?: string[] | null;
  linkedinUrl?: string | null;
};

export async function extractCVData(rawText: string): Promise<CVData> {
  const prompt = `
You are an expert CV parser. Extract structured information from the CV text below.
Return ONLY a valid JSON object — no markdown, no explanation, no code blocks.

CV Text:
"""
${rawText}
"""

Return exactly this JSON shape (use null for missing fields, empty array for skills if none found):
{
  "name": "full name as string",
  "email": "email address or null",
  "phone": "phone number or null",
  "linkedinUrl": "LinkedIn profile URL or null",
  "skills": ["array", "of", "top technical and soft skills (max 15)"],
  "experienceYears": 0,
  "currentRole": "most recent job title or null",
  "jobTitles": ["array", "of", "all job titles held or null"],
  "industry": "primary industry/domain (e.g. Software Engineering, Finance, Healthcare) or null",
  "education": "highest qualification as a short string (e.g. B.Tech Computer Science)",
  "summary": "2-3 sentence professional summary highlighting key expertise and career focus"
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
    const parsed = JSON.parse(cleaned) as CVData;

    // Ensure skills is always an array
    if (!Array.isArray(parsed.skills)) {
      parsed.skills = [];
    }

    // Ensure experienceYears is a number
    if (typeof parsed.experienceYears !== "number") {
      parsed.experienceYears = 0;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse CV data:", error);
    throw new Error("AI returned invalid JSON. Try re-uploading the CV.");
  }
}
