import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/cv/generate-questions";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cvData, industry, level } = (await req.json()) as {
      cvData: CVData;
      industry: string;
      level: string;
    };

    if (!cvData || !industry || !level) {
      return NextResponse.json(
        { error: "Missing required fields (cvData, industry, level)" },
        { status: 400 },
      );
    }

    const questions = await generateInterviewQuestions(
      cvData,
      industry,
      level,
    );

    return NextResponse.json({ success: true, questions });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("[GENERATE_INTERVIEW_QUESTIONS]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
