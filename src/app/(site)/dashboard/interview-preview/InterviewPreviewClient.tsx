"use client";

import { useEffect, useRef, useState } from "react";
import InterviewSession, { type InterviewAnswer } from "../InterviewSession";

const MOCK_QUESTIONS = [
  "You have a system processing 1 million requests per day. Describe how you would design a rate-limiting service that is both accurate and highly available, without introducing significant latency.",
  "Tell me about a time you disagreed with a technical decision made by your team. How did you handle it?",
  "How would you design a URL shortener like bit.ly? Walk through the data model, the API, and how you'd scale it.",
  "What's the difference between optimistic and pessimistic locking, and when would you choose one over the other?",
  "Describe a project you're most proud of and what your specific contribution was.",
];

export default function InterviewPreviewClient() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<InterviewAnswer[] | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError("");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        setStream(s);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : "";
        setError(
          name === "NotAllowedError"
            ? "Camera/mic permission was blocked. Allow access in your browser, or preview without a camera below."
            : name === "NotFoundError"
              ? "No camera/mic found on this device. You can still preview the UI without a camera."
              : "Couldn't start the camera/mic. You can still preview the UI without a camera."
        );
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [attempt]);

  // Fake, black video+silent-audio stream so the Interview Room UI can be
  // previewed even when no real camera/mic is available (dev only).
  const useDummyStream = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      const draw = () => {
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#181C2C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // The <video> is CSS-mirrored (scale-x-[-1]) for real webcams, so
        // pre-flip the text here to keep it readable in preview mode.
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.fillStyle = "#6B7299";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "No camera — preview mode",
          canvas.width / 2,
          canvas.height / 2
        );
        ctx.restore();
      };
      draw();
      const interval = setInterval(draw, 1000);
      const videoStream = canvas.captureStream(2);

      const audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      audioCtx.createOscillator().connect(dest); // silent-ish; not started

      const combined = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);
      // stop the redraw loop when the track ends
      combined.getVideoTracks()[0].addEventListener("ended", () =>
        clearInterval(interval)
      );
      streamRef.current = combined;
      setStream(combined);
      setError("");
    } catch {
      setError("Preview stream could not be created in this browser.");
    }
  };

  if (completed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">
          Preview finished ✓
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          {completed.length} answers captured (preview only — nothing was saved).
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Restart preview
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
            📷
          </div>
          <h1 className="mb-2 text-lg font-semibold text-gray-900">
            Camera / mic unavailable
          </h1>
          <p className="mb-6 text-sm text-gray-600">{error}</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setAttempt((n) => n + 1)}
              className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              🔄 Try camera again
            </button>
            <button
              onClick={useDummyStream}
              className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              🎬 Preview UI without camera
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-600">Requesting camera &amp; mic…</p>
        </div>
      </div>
    );
  }

  return (
    <InterviewSession
      questions={MOCK_QUESTIONS}
      stream={stream}
      onComplete={(answers) => setCompleted(answers)}
      onCancelled={(violation) => {
        console.warn("Preview interview cancelled:", violation);
      }}
    />
  );
}
