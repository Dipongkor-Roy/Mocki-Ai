import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HistoryTable from "./HistoryTable";

export default async function HistoryPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });
  if (!dbUser) redirect("/dashboard");

  const interviews = await prisma.interview.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      industry: true,
      level: true,
      createdAt: true,
      completed: true,
      report: { select: { overallScore: true } },
    },
  });

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              All your past practice interviews and reports · {interviews.length} total
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <HistoryTable
          interviews={interviews.map((i) => ({
            id: i.id,
            industry: i.industry,
            level: i.level,
            createdAt: i.createdAt,
            completed: i.completed,
            overallScore: i.report?.overallScore ?? null,
          }))}
        />
      </div>
    </div>
  );
}
