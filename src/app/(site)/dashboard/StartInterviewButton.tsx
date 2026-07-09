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
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 hover:scale-105 active:scale-95"
      >
        <span>🎯</span>
        Start Interview
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="mb-4">
              <div className="inline-block rounded-full bg-indigo-100 p-3 mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Ready to start?
              </h3>
            </div>

            {!hasCv && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                <p className="font-semibold mb-1">💡 Pro Tip</p>
                <p>
                  Uploading your CV helps AI tailor questions to your background
                  for better practice.
                </p>
              </div>
            )}

            <p className="mt-5 text-sm text-gray-600 leading-relaxed">
              {hasCv
                ? "Your CV is loaded. AI will ask personalized questions based on your experience and skills."
                : "You can start without a CV, but personalized questions work best with one."}
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/interview/new")}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-md transition-all"
              >
                Let&apos;s Go 🎯
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
