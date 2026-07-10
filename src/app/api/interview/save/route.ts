import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { InterviewEvaluation } from "@/lib/cv/evaluate-interview";

interface SaveInterviewBody {
  industry: string;
  level: string;
  questions: string[];
  answers: {
    question: string;
    transcript: string;
    skipped: boolean;
  }[];
  duration?: number;
  evaluation: InterviewEvaluation;
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as SaveInterviewBody;
    const { industry, level, questions, answers, duration, evaluation } = body;

    if (!industry || !level || !questions || !answers || !evaluation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transcript = answers
      .map((a, idx) => `Q${idx + 1}: ${a.question}\nA: ${a.skipped ? "[Skipped]" : a.transcript}`)
      .join("\n\n");

    const interview = await prisma.interview.create({
      data: {
        userId: dbUser.id,
        industry,
        level,
        questions,
        answers,
        duration: duration ?? null,
        transcript,
        completed: true,
        report: {
          create: {
            overallScore: evaluation.overallScore,
            technicalScore: evaluation.technicalScore,
            communicationScore: evaluation.communicationScore,
            confidenceScore: evaluation.confidenceScore,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
            summary: evaluation.summary,
            recommendation: evaluation.recommendation,
            cameraFeedback:
              evaluation.confidenceActivities as unknown as Prisma.InputJsonValue,
            voiceFeedback:
              evaluation.answerEvaluations as unknown as Prisma.InputJsonValue,
          },
        },
      },
      include: { report: true },
    });

    return NextResponse.json({ success: true, interview });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("[SAVE_INTERVIEW]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
