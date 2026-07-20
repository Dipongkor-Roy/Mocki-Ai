"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Trash2, Download } from "lucide-react";

export interface HistoryRow {
  id: string;
  industry: string;
  level: string;
  createdAt: string | Date;
  completed: boolean;
  overallScore: number | null;
}

function decisionBadge(score: number) {
  if (score >= 72) {
    return {
      label: "Ready to apply",
      className: "bg-green-50 text-green-700 border border-green-200",
    };
  }
  if (score >= 55) {
    return {
      label: "Almost there",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    };
  }
  return {
    label: "Needs practice",
    className: "bg-red-50 text-red-700 border border-red-200",
  };
}

function scoreColor(score: number) {
  if (score >= 72) return "text-green-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-500";
}

export default function HistoryTable({
  interviews,
  reportHrefBase = "/dashboard/history",
  deletable = false,
}: {
  interviews: HistoryRow[];
  reportHrefBase?: string;
  deletable?: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<HistoryRow[]>(interviews);
  const [pendingDelete, setPendingDelete] = useState<HistoryRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Always show the most recent interview first, regardless of caller order.
  const sortedInterviews = [...rows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/interview/${pendingDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      toast.success("Interview deleted.");
      setPendingDelete(null);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm ring-1 ring-gray-100 text-center">
        <div className="text-3xl mb-3 opacity-40">✨</div>
        <p className="text-sm font-semibold text-gray-700">No interviews yet</p>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          Complete an interview from the dashboard to see it here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-3 pl-4 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Interview
              </th>
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Date
              </th>
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Status
              </th>
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Score
              </th>
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Suggestion
              </th>
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Report
              </th>
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInterviews.map((interview) => {
              const badge =
                interview.overallScore !== null
                  ? decisionBadge(interview.overallScore)
                  : null;
              return (
                <tr
                  key={interview.id}
                  onClick={() => {
                    if (interview.overallScore !== null) {
                      router.push(`${reportHrefBase}/${interview.id}`);
                    }
                  }}
                  className={`border-b border-gray-50 last:border-0 transition-colors ${
                    interview.overallScore !== null
                      ? "cursor-pointer hover:bg-indigo-50/40"
                      : "hover:bg-gray-50/60"
                  }`}
                >
                  <td className="py-4 pl-4 pr-4">
                    <p className="font-semibold text-gray-900">
                      {interview.industry}
                    </p>
                    <p className="text-xs text-gray-400">{interview.level}</p>
                  </td>
                  <td className="py-4 pr-4 text-gray-600">
                    {new Date(interview.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    <p className="text-xs text-gray-400">
                      {new Date(interview.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`-ml-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                        interview.completed
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {interview.completed ? "Completed" : "In Progress"}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    {interview.overallScore !== null ? (
                      <span
                        className={`font-bold ${scoreColor(interview.overallScore)}`}
                      >
                        {interview.overallScore}
                        <span className="text-xs font-normal text-gray-400">
                          /100
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {badge ? (
                      <span
                        className={`-ml-2.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {interview.overallScore !== null ? (
                      <Link
                        href={`${reportHrefBase}/${interview.id}`}
                        onClick={(e) => e.stopPropagation()}
                        title="View & download report"
                        className="-ml-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <span>📊 Report</span>
                        <Download size={13} />
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-300">No report</span>
                    )}
                  </td>
                  <td className="py-4 pl-2 pr-4">
                    {deletable ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete(interview);
                        }}
                        aria-label="Delete interview"
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => !deleting && setPendingDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Delete this interview?
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              This will permanently remove{" "}
              <span className="font-semibold text-gray-800">
                {pendingDelete.industry}
              </span>{" "}
              and its report. This action can&apos;t be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
