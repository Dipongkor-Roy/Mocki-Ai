"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartInterviewButton({ hasCv }: { hasCv: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        + Start Interview
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Ready to start?
            </h3>
            {!hasCv && (
              <p className="mt-2 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                ⚠️ No CV uploaded yet. Adding one helps AI tailor your
                questions.
              </p>
            )}
            <p className="mt-3 text-sm text-gray-500">
              {hasCv
                ? "Your CV is ready. AI will tailor questions to your background."
                : "You can still continue without a CV."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/interview/new")}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Let&apos;s Go 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
