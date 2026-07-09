import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CVSection from "./CVSection";
import StartInterviewButton from "./StartInterviewButton";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      interviews: { orderBy: { createdAt: "desc" }, take: 5 },
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
      include: { interviews: true },
    });
  }

  const displayName =
    user.firstName ||
    user.username ||
    user.emailAddresses[0]?.emailAddress.split("@")[0];

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const cvData = (dbUser.cvData as CVData | null) ?? null;
  const hasCv = !!cvData;
  const interviews = dbUser.interviews;
  const totalInterviews = interviews.length;
  const completedCount = interviews.filter(
    (i: (typeof interviews)[number]) => i.completed,
  ).length;

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12  flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
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
          </div>
          <StartInterviewButton hasCv={hasCv} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Content - CV + Quick Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* CV Section */}
            <CVSection initialCvData={cvData} />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
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
              <StatCard label="Avg. Score" value="—" icon="⭐" />
            </div>
          </div>

          {/* Sidebar - Interview History */}
          <div className="lg:col-span-1">
            <section className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 flex flex-col">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Recent Activity
              </h2>
              {dbUser.interviews.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">No interviews yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Start one to see history
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3 flex-1 overflow-y-auto">
                  {interviews
                    .slice(0, 5)
                    .map((interview: (typeof interviews)[number]) => (
                      <li
                        key={interview.id}
                        className="text-sm border-l-2 border-indigo-200 pl-3 py-1"
                      >
                        <p className="font-medium text-gray-700">
                          {interview.industry} · {interview.level}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(interview.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <span
                          className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            interview.completed
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {interview.completed ? "Done" : "In Progress"}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        {/* Full Width - Previous Reports */}
        {totalInterviews > 0 && (
          <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Performance Reports
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered feedback on your interviews
              </p>
            </div>
            <EmptyState
              title="No reports generated yet"
              description="Complete an interview to generate your detailed performance analysis and recommendations."
            />
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
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 hover:ring-indigo-200 transition-all">
      {icon && <span className="text-xl mb-2 block">{icon}</span>}
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
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
