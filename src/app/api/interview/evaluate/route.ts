import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { evaluateInterview, type AnswerInput } from "@/lib/cv/evaluate-interview";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { answers, industry, level } = (await req.json()) as {
      answers: AnswerInput[];
      industry: string;
      level: string;
    };

    if (!answers || !Array.isArray(answers) || !industry || !level) {
      return NextResponse.json(
        { error: "Missing required fields (answers, industry, level)" },
        { status: 400 },
      );
    }

    const evaluation = await evaluateInterview(answers, industry, level);

    return NextResponse.json({ success: true, evaluation });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("[EVALUATE_INTERVIEW]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
