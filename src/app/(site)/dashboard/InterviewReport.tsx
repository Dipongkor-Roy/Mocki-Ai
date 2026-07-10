"use client";

import { useRef, useState } from "react";
import type { InterviewEvaluation } from "@/lib/cv/evaluate-interview";

interface InterviewReportProps {
  evaluation: InterviewEvaluation;
  industry: string;
  level: string;
  candidateName?: string;
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const color =
    score >= 75
      ? "text-green-700 bg-green-50 border-green-200"
      : score >= 50
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className={`rounded-lg border px-2 py-2 text-center ${color}`}>
      <p className="text-xl font-bold">{score}</p>
      <p className="text-[11px] font-medium mt-0.5 leading-tight break-words">
        {label}
      </p>
    </div>
  );
}

export default function InterviewReport({
  evaluation,
  industry,
  level,
  candidateName,
}: InterviewReportProps) {
  const {
    overallScore,
    technicalScore,
    communicationScore,
    confidenceScore,
    strengths,
    improvements,
    summary,
    recommendation,
    answerEvaluations,
    confidenceActivities,
  } = evaluation;

  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const node = reportRef.current;
    if (!node) return;
    setDownloading(true);

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `interview-report-${industry.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      ref={reportRef}
      className="mx-auto rounded-lg bg-white p-5 sm:p-8 md:p-12 shadow-md ring-1 ring-gray-200 overflow-x-hidden"
    >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Interview Report
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {candidateName ? `${candidateName} · ` : ""}
              {industry} · {level}
            </p>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            data-html2canvas-ignore="true"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto"
          >
            {downloading ? "Generating PDF..." : "⬇ Download as PDF"}
          </button>
        </div>

        {/* Overall Score */}
        <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Overall Score</p>
            <p className="text-4xl font-bold text-indigo-700 mt-1">
              {overallScore}
              <span className="text-lg text-gray-400">/100</span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ScoreBadge label="Technical" score={technicalScore} />
            <ScoreBadge label="Communication" score={communicationScore} />
            <ScoreBadge label="Confidence" score={confidenceScore} />
          </div>
        </div>

        {/* Summary + Recommendation */}
        <div className="mb-6 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Summary
            </h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Recommendation
            </h3>
            <p className="text-sm text-gray-700">{recommendation}</p>
          </div>
        </div>

        {/* Strengths / Improvements */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              Strengths
            </h3>
            <ul className="space-y-1">
              {strengths.map((s, idx) => (
                <li key={idx} className="text-sm text-green-900 flex gap-2">
                  <span>✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">
              Areas to Improve
            </h3>
            <ul className="space-y-1">
              {improvements.map((s, idx) => (
                <li key={idx} className="text-sm text-amber-900 flex gap-2">
                  <span>→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Confidence Evaluation Breakdown */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Confidence Evaluation
          </h3>
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left font-medium px-4 py-2">Activity</th>
                  <th className="text-right font-medium px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {confidenceActivities.map((c, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-4 py-2 text-gray-800">{c.activity}</td>
                    <td
                      className={`px-4 py-2 text-right font-semibold ${
                        c.points >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {c.points >= 0 ? `+${c.points}` : c.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Per-Question Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Question-by-Question Breakdown
          </h3>
          <div className="space-y-3">
            {answerEvaluations.map((a, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  a.skipped
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Q{idx + 1}. {a.question}
                  </p>
                  {a.skipped && (
                    <span className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Skipped
                    </span>
                  )}
                </div>

                {a.skipped ? (
                  <p className="text-sm text-gray-400 italic mt-2">
                    No answer was given for this question.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mt-2">
                      {a.transcript || (
                        <span className="text-gray-400 italic">
                          No transcript captured
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                        Relevance: {a.relevance}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                        Clarity: {a.clarity}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
                        Confidence: {a.confidence}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{a.feedback}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

