import { notFound } from "next/navigation";
import Link from "next/link";
import HistoryTable, { type HistoryRow } from "../history/HistoryTable";

// Dev-only route to preview the History table UI with dummy data, without
// touching the database. Returns 404 in production so it can never ship live.
const DUMMY_INTERVIEWS: HistoryRow[] = [
  {
    id: "dummy-1",
    industry: "Senior Backend Engineer",
    level: "Senior",
    createdAt: "2026-07-08T14:30:00Z",
    completed: true,
    overallScore: 82,
  },
  {
    id: "dummy-2",
    industry: "Frontend Developer",
    level: "Mid-level",
    createdAt: "2026-07-05T10:15:00Z",
    completed: true,
    overallScore: 61,
  },
  {
    id: "dummy-3",
    industry: "ML Engineer",
    level: "Lead",
    createdAt: "2026-06-29T09:00:00Z",
    completed: true,
    overallScore: 44,
  },
  {
    id: "dummy-4",
    industry: "Product Manager",
    level: "Manager",
    createdAt: "2026-06-20T16:45:00Z",
    completed: true,
    overallScore: 70,
  },
  {
    id: "dummy-5",
    industry: "Data Analyst",
    level: "Junior",
    createdAt: "2026-06-12T11:20:00Z",
    completed: true,
    overallScore: 76,
  },
  {
    id: "dummy-6",
    industry: "DevOps Engineer",
    level: "Senior",
    createdAt: "2026-06-02T13:00:00Z",
    completed: false,
    overallScore: null,
  },
];

export default function HistoryPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
          🧪 Dev preview — dummy data, not connected to the database
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              All your past practice interviews and reports · {DUMMY_INTERVIEWS.length} total
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
          interviews={DUMMY_INTERVIEWS}
          reportHrefBase="/dashboard/history-preview/report"
        />
      </div>
    </div>
  );
}
