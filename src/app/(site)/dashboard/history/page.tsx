import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) redirect("/dashboard");

  const interviews = await prisma.interview.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    include: { report: true },
  });

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              All your past practice interviews and reports
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm ring-1 ring-gray-100 text-center">
            <div className="text-3xl mb-3 opacity-40">✨</div>
            <p className="text-sm font-semibold text-gray-700">
              No interviews yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Complete an interview from the dashboard to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <Link
                key={interview.id}
                href={`/dashboard/history/${interview.id}`}
                className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 hover:ring-indigo-200 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {interview.industry} · {interview.level}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(interview.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                      interview.completed
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {interview.completed ? "Completed" : "In Progress"}
                  </span>
                </div>
                {interview.report && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-700">
                      {interview.report.overallScore}
                      <span className="text-sm text-gray-400">/100</span>
                    </p>
                    <p className="text-xs text-gray-400">Overall Score</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
