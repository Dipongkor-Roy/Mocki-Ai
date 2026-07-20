"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import type { CVData } from "@/lib/cv/extract-with-gemini";
import InterviewSession, { type InterviewAnswer } from "./InterviewSession";
import InterviewReport from "./InterviewReport";
import type { InterviewEvaluation } from "@/lib/cv/evaluate-interview";
import { mockInterviewEvaluation } from "@/lib/cv/mock-evaluation";

interface InterviewSetupProps {
  cvData: CVData;
  onReportStageChange?: (isReportStage: boolean) => void;
}

type Stage =
  | "setup"
  | "generating"
  | "session"
  | "generating-report"
  | "report";

export default function InterviewSetup({
  cvData,
  onReportStageChange,
}: InterviewSetupProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(
    cvData.industry || "",
  );

  const defaultLevel =
    cvData.experienceYears <= 1
      ? "Fresher"
      : cvData.experienceYears <= 3
        ? "Junior"
        : cvData.experienceYears <= 5
          ? "Mid-level"
          : cvData.experienceYears <= 8
            ? "Senior"
            : cvData.experienceYears <= 10
              ? "Lead"
              : "Manager";

  const [selectedLevel, setSelectedLevel] = useState(defaultLevel);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "idle" | "requesting" | "granted" | "denied"
  >("idle");
  const [permissionError, setPermissionError] = useState("");
  const [stage, setStage] = useState<Stage>("setup");
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsError, setQuestionsError] = useState("");
  const [finalAnswers, setFinalAnswers] = useState<InterviewAnswer[]>([]);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(
    null,
  );
  const [reportError, setReportError] = useState("");
  const streamRef = useRef<MediaStream | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  useEffect(() => {
    onReportStageChange?.(stage === "generating-report" || stage === "report");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const industries = [
    "Software Engineering",
    "Data Science",
    "Product Management",
    "Finance",
    "Healthcare",
    "Marketing",
    "Sales",
    "Design",
    "HR",
    "Operations",
    "Other",
  ];

  const experienceLevels = [
    "Fresher",
    "Junior",
    "Mid-level",
    "Senior",
    "Lead",
    "Manager",
  ];

  const handleStartInterview = () => {
    if (!selectedIndustry || !selectedLevel) {
      alert("Please select both industry and experience level");
      return;
    }
    setShowConfirmModal(true);
  };

  const generateQuestions = async () => {
    setStage("generating");
    setQuestionsError("");
    try {
      const res = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData,
          industry: selectedIndustry,
          level: selectedLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }
      setQuestions(data.questions);
      sessionStartRef.current = Date.now();
      setStage("session");
    } catch (error) {
      setQuestionsError(
        error instanceof Error
          ? error.message
          : "Failed to generate interview questions. Please try again.",
      );
      setStage("setup");
    }
  };

  const requestPermissionAndGenerate = async () => {
    setPermissionStatus("requesting");
    setPermissionError("");

    // getUserMedia only works on secure origins (https or localhost).
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setPermissionStatus("denied");
      setPermissionError(
        "Your browser can't access the camera/mic here. This usually happens on an insecure connection — open the site over https:// or on localhost and try again.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      setPermissionStatus("granted");
      setShowConfirmModal(false);
      await generateQuestions();
    } catch (error) {
      setPermissionStatus("denied");

      const name = error instanceof DOMException ? error.name : "";
      let message: string;
      if (name === "NotAllowedError" || name === "SecurityError") {
        message =
          "Camera/microphone access was blocked. Click the camera icon in your browser's address bar, allow access, then try again.";
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        message =
          "No camera or microphone was found. Please connect one and try again.";
      } else if (name === "NotReadableError") {
        message =
          "Your camera/microphone is already in use by another app. Close it (Zoom, Meet, etc.) and try again.";
      } else {
        message =
          "Could not access webcam/microphone. Please allow permission and try again.";
      }
      setPermissionError(message);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setPermissionStatus("idle");
    setPermissionError("");
  };

  const handleLoadSampleReport = () => {
    setEvaluation(mockInterviewEvaluation);
    setStage("report");
  };

  const handleRetryPermission = () => {
    setPermissionStatus("idle");
    setPermissionError("");
    requestPermissionAndGenerate();
  };

  const handleSessionComplete = async (answers: InterviewAnswer[]) => {
    setFinalAnswers(answers);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setStage("generating-report");
    setReportError("");

    const plainAnswers = answers.map((a) => ({
      question: a.question,
      transcript: a.transcript,
      skipped: a.skipped,
    }));

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: plainAnswers,
          industry: selectedIndustry,
          level: selectedLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report");
      }
      setEvaluation(data.evaluation);
      setStage("report");

      const duration = sessionStartRef.current
        ? Math.round((Date.now() - sessionStartRef.current) / 1000)
        : undefined;

      // Persist the interview + report so it shows up in History and dashboard stats
      fetch("/api/interview/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: selectedIndustry,
          level: selectedLevel,
          questions,
          answers: plainAnswers,
          duration,
          evaluation: data.evaluation,
        }),
      })
        .then((saveRes) => {
          if (!saveRes.ok) throw new Error("Save failed");
          toast.success("Report saved! You can find it anytime in History.");
        })
        .catch((err) => {
          console.error("Failed to save interview:", err);
          toast.error(
            "Your report is ready, but saving it to History failed. You can still view it below.",
          );
        });
    } catch (error) {
      setReportError(
        error instanceof Error
          ? error.message
          : "Failed to generate your interview report. Please try again.",
      );
      setStage("report");
    }
  };

  if (stage === "session" && streamRef.current) {
    return (
      <InterviewSession
        questions={questions}
        stream={streamRef.current}
        onComplete={handleSessionComplete}
      />
    );
  }

  if (stage === "generating-report") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Interview Completed
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {selectedIndustry} · {selectedLevel}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="mt-5 text-base font-semibold text-gray-800">
            Generating Report...
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Analyzing your answers, this may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (stage === "report") {
    if (evaluation) {
      return (
        <InterviewReport
          evaluation={evaluation}
          industry={selectedIndustry}
          level={selectedLevel}
          candidateName={cvData.name}
        />
      );
    }

    // Fallback: report generation failed, show raw answers instead
    const answeredCount = finalAnswers.filter((a) => !a.skipped).length;
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Interview Completed
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {answeredCount} of {questions.length} questions answered
          </p>
        </div>

        {reportError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-600">{reportError}</p>
          </div>
        )}

        <div className="space-y-3">
          {finalAnswers.map((a, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Q{idx + 1}. {a.question}
              </p>
              {a.skipped ? (
                <p className="text-sm text-amber-600 italic">Skipped</p>
              ) : (
                <p className="text-sm text-gray-800">
                  {a.transcript || (
                    <span className="text-gray-400 italic">
                      No transcript captured
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Loader while AI generates questions, before entering the interview room
  if (stage === "generating") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Preparing Your Interview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedIndustry} · {selectedLevel}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="mt-4 text-sm font-medium text-gray-700">
            Generating your interview questions...
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:h-full min-h-[500px] lg:min-h-[550px] flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Interview Setup</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure your interview parameters based on your profile
        </p>
      </div>

      <div className="space-y-6">
        {/* CV Summary Card */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Your Profile Summary
          </h3>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-900">
                {cvData.name}
              </span>
            </div>
            {cvData.currentRole && (
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">Current Role:</span>
                <span className="text-sm font-medium text-gray-900">
                  {cvData.currentRole}
                </span>
              </div>
            )}
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-600">Experience:</span>
              <span className="text-sm font-medium text-gray-900">
                {cvData.experienceYears} year
                {cvData.experienceYears !== 1 ? "s" : ""}
              </span>
            </div>
            {cvData.skills.length > 0 && (
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">Top Skills:</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                  {cvData.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Select Industry / Domain
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">
              {selectedIndustry ? selectedIndustry : "Choose industry..."}
            </option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Pre-filled with extracted industry. Change if needed.
          </p>
        </div>

        {/* Experience Level Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Select Experience Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            {experienceLevels.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Pre-filled based on your experience. Adjust if needed.
          </p>
        </div>

        {questionsError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-600">{questionsError}</p>
          </div>
        )}

        {/* Start Interview Button */}
        <button
          onClick={handleStartInterview}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
        >
          🎤 Start Interview
        </button>
        {/* dev mode ui test  */}
        {process.env.NODE_ENV === "development" && (
          <>
            {/* <button
              onClick={handleLoadSampleReport}
              className="w-full px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              🧪 Load Sample Report (dev only)
            </button>
            <a
              href="/dashboard/interview-preview"
              className="block w-full px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all text-center"
            >
              🎬 Preview Interview Room UI (dev only)
            </a>
            <a
              href="/dashboard/history-preview"
              className="block w-full px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all text-center"
            >
              📋 Preview History Table (dev only)
            </a> */}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Ready to Start Interview?
            </h3>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600">
                • There will be a total of{" "}
                <span className="font-medium text-gray-900">9 questions</span>
              </p>
              <p className="text-sm text-gray-600">
                • Each question will have{" "}
                <span className="font-medium text-gray-900">1 minute</span> to
                answer
              </p>
              <p className="text-sm text-gray-600">
                • Total interview time will be{" "}
                <span className="font-medium text-gray-900">9 minutes</span>
              </p>
              <p className="text-sm text-gray-600">
                • You will need to grant{" "}
                <span className="font-medium text-gray-900">
                  Webcam and Microphone
                </span>{" "}
                access to start
              </p>
            </div>

            {permissionStatus === "denied" && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-sm text-red-600">
                  {permissionError ||
                    "Webcam/Microphone access was denied. Please allow access and try again."}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelModal}
                disabled={permissionStatus === "requesting"}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={
                  permissionStatus === "denied"
                    ? handleRetryPermission
                    : requestPermissionAndGenerate
                }
                disabled={permissionStatus === "requesting"}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {permissionStatus === "requesting"
                  ? "Requesting Access..."
                  : permissionStatus === "denied"
                    ? "Retry"
                    : "Yes, Start Interview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
