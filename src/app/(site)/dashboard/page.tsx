import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      interviews: {
        orderBy: { createdAt: "desc" },
        include: { report: true },
      },
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.firstName ?? user.username ?? null,
        image: user.imageUrl ?? null,
      },
      include: { interviews: { include: { report: true } } },
    });
  }

  const displayName =
    user.firstName ||
    user.username ||
    user.emailAddresses[0]?.emailAddress.split("@")[0];

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const cvData = (dbUser.cvData as CVData | null) ?? null;
  const interviews = dbUser.interviews;
  const totalInterviews = interviews.length;
  const completedCount = interviews.filter(
    (i: (typeof interviews)[number]) => i.completed,
  ).length;
  const scoredInterviews = interviews.filter(
    (i: (typeof interviews)[number]) => i.report,
  );
  const avgScore =
    scoredInterviews.length > 0
      ? Math.round(
          scoredInterviews.reduce(
            (sum: number, i: (typeof interviews)[number]) =>
              sum + (i.report?.overallScore ?? 0),
            0,
          ) / scoredInterviews.length,
        )
      : null;
  const recentInterviews = interviews.slice(0, 5);

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={displayName ?? "User"}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-indigo-100"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-lg font-semibold text-white">
                {displayName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {displayName}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{email}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <StatCard
              label="Total Interviews"
              value={String(totalInterviews)}
              icon="📊"
            />
            <StatCard
              label="Completed"
              value={String(completedCount)}
              icon="✓"
            />
            <StatCard
              label="Avg. Score"
              value={avgScore !== null ? String(avgScore) : "—"}
              icon="⭐"
            />
          </div>
        </div>

        {/* Main Grid - CV + Interview Setup / Recent Activity */}
        <DashboardClient
          initialCvData={cvData}
          interviews={recentInterviews.map((i) => ({
            id: i.id,
            industry: i.industry,
            level: i.level,
            completed: i.completed,
            createdAt: i.createdAt,
          }))}
        />

        {/* Full Width - Previous Reports */}
        {totalInterviews > 0 && (
          <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance Reports
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  AI-powered feedback on your interviews
                </p>
              </div>
              {scoredInterviews.length > 0 && (
                <Link
                  href="/dashboard/history"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All →
                </Link>
              )}
            </div>

            {scoredInterviews.length === 0 ? (
              <EmptyState
                title="No reports generated yet"
                description="Complete an interview to generate your detailed performance analysis and recommendations."
              />
            ) : (
              <div className="space-y-3">
                {scoredInterviews.slice(0, 5).map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/dashboard/history/${interview.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {interview.industry} · {interview.level}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(interview.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-700">
                        {interview.report?.overallScore}
                        <span className="text-xs text-gray-400">/100</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100 hover:ring-indigo-200 transition-all min-w-[92px]">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-sm">{icon}</span>}
        <p className="text-[10px] uppercase tracking-wide text-gray-500 font-medium truncate">
          {label}
        </p>
      </div>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 border-opacity-50 py-12 px-4 text-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-3xl mb-3 opacity-40">✨</div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="mt-2 text-sm text-gray-500 max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
