import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InterviewReport from "../../InterviewReport";
import {
  computeChannelScore,
  type InterviewEvaluation,
  type AnswerEvaluation,
  type ConfidenceActivity,
} from "@/lib/cv/evaluate-interview";

interface AnswerRecord {
  question: string;
  transcript: string;
  skipped: boolean;
}

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });
  if (!dbUser) redirect("/dashboard");

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { report: true },
  });

  if (!interview || interview.userId !== dbUser.id) {
    notFound();
  }

  if (!interview.report) {
    return (
      <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard/history"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to History
          </Link>
          <div className="mt-6 rounded-2xl bg-white p-12 shadow-sm ring-1 ring-gray-100 text-center">
            <p className="text-sm font-semibold text-gray-700">
              No report available for this interview.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const answers = interview.answers as unknown as AnswerRecord[];
  const answerEvaluations =
    (interview.report.voiceFeedback as unknown as AnswerEvaluation[]) ?? [];
  const confidenceActivities =
    (interview.report.cameraFeedback as unknown as ConfidenceActivity[]) ?? [];

  const confidenceScore = interview.report.confidenceScore;

  const evaluation: InterviewEvaluation = {
    overallScore: interview.report.overallScore,
    technicalScore: interview.report.technicalScore,
    communicationScore: interview.report.communicationScore,
    confidenceScore,
    faceScore: computeChannelScore(
      confidenceActivities,
      "face",
      confidenceScore,
    ),
    voiceScore: computeChannelScore(
      confidenceActivities,
      "voice",
      confidenceScore,
    ),
    strengths: interview.report.strengths,
    improvements: interview.report.improvements,
    summary: interview.report.summary,
    recommendation: interview.report.recommendation,
    answerEvaluations:
      answerEvaluations.length > 0
        ? answerEvaluations
        : answers.map((a) => ({
            question: a.question,
            transcript: a.transcript,
            skipped: a.skipped,
            relevance: 0,
            clarity: 0,
            confidence: 0,
            feedback: "",
          })),
    confidenceActivities,
  };

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/history"
          className="mb-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to History
        </Link>
        <InterviewReport
          evaluation={evaluation}
          industry={interview.industry}
          level={interview.level}
          candidateName={
            user.firstName ||
            user.username ||
            user.emailAddresses[0]?.emailAddress
          }
        />
      </div>
    </div>
  );
}
