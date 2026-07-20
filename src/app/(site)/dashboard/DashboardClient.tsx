"use client";

import { useState } from "react";
import CVSection from "./CVSection";
import InterviewSetup from "./InterviewSetup";
import type { CVData } from "@/lib/cv/extract-with-gemini";

interface InterviewSummary {
  id: string;
  industry: string;
  level: string;
  completed: boolean;
  createdAt: string | Date;
}

export default function DashboardClient({
  initialCvData,
  interviews,
}: {
  initialCvData: CVData | null;
  interviews: InterviewSummary[];
}) {
  const [cvData, setCvData] = useState<CVData | null>(initialCvData);
  const [isReportStage, setIsReportStage] = useState(false);

  return (
    <div
      className={
        isReportStage && cvData ? "" : "grid grid-cols-1 lg:grid-cols-3 gap-6"
      }
    >
      {/* Main Content - CV */}
      <div
        className={
          isReportStage && cvData ? "hidden" : "lg:col-span-2 lg:h-full space-y-6"
        }
      >
        <CVSection cvData={cvData} onCvDataChange={setCvData} />
      </div>

      {/* Sidebar - Interview Setup or Recent Activity, becomes the full report view */}
      <div className={isReportStage && cvData ? "" : "lg:col-span-1"}>
        {cvData ? (
          <InterviewSetup
            cvData={cvData}
            onReportStageChange={setIsReportStage}
          />
        ) : (
          <RecentActivity interviews={interviews} />
        )}
      </div>
    </div>
  );
}

function RecentActivity({ interviews }: { interviews: InterviewSummary[] }) {
  return (
    <section className="lg:h-full min-h-[500px] lg:min-h-[550px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 flex flex-col">
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Recent Activity
      </h2>
      {interviews.length === 0 ? (
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
          {interviews.map((interview) => (
            <li
              key={interview.id}
              className="text-sm border-l-2 border-indigo-200 pl-3 py-1"
            >
              <p className="font-medium text-gray-700">
                {interview.industry} · {interview.level}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(interview.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
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
  );
}
