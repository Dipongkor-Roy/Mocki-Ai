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
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome Card */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={displayName ?? "User"}
                width={56}
                height={56}
                className="rounded-full ring-2 ring-indigo-100"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
                {displayName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {displayName} 👋
              </h1>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <StartInterviewButton hasCv={hasCv} />
        </div>

        {/* CV Section */}
        <CVSection initialCvData={cvData} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Interviews" value={String(totalInterviews)} />
          <StatCard label="Completed" value={String(completedCount)} />
          <StatCard label="Avg. Score" value="—" />
        </div>

        {/* Interview History */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Interview History
          </h2>
          {dbUser.interviews.length === 0 ? (
            <EmptyState
              title="No interviews yet"
              description="Start your first mock interview to see your history here."
            />
          ) : (
            <ul className="space-y-2">
              {interviews.map((interview: (typeof interviews)[number]) => (
                <li
                  key={interview.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {interview.industry} · {interview.level}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      interview.completed
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {interview.completed ? "Completed" : "In Progress"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Previous Reports */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Previous Reports
          </h2>
          <EmptyState
            title="No reports yet"
            description="Complete an interview to generate your AI performance report."
          />
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  );
}
