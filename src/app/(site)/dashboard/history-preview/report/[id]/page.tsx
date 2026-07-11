import { notFound } from "next/navigation";
import Link from "next/link";
import InterviewReport from "../../../InterviewReport";
import { mockInterviewEvaluation } from "@/lib/cv/mock-evaluation";

// Dev-only route to preview the report detail UI (and PDF export) with
// dummy data. Returns 404 in production so it can never ship live.
export default function HistoryPreviewReportPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
          🧪 Dev preview — dummy report data
        </div>
        <Link
          href="/dashboard/history-preview"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to History
        </Link>
        <InterviewReport
          evaluation={mockInterviewEvaluation}
          industry="Senior Backend Engineer"
          level="Senior"
          candidateName="Preview Candidate"
        />
      </div>
    </div>
  );
}
