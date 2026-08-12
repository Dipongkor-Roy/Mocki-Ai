"use client";

import { useEffect, useRef, useState } from "react";

export type ProctoringViolation =
  | "multiple-faces"
  | "no-face"
  | "tab-switch"
  | "screen-share";

interface UseProctoringOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  onViolation: (violation: ProctoringViolation) => void;
}

const FACE_CHECK_INTERVAL_MS = 2000; // frequent enough to catch a second face quickly
const FACE_DETECTOR_INPUT_SIZE = 224; // larger input catches smaller/dim faces than 160
const MULTI_FACE_GRACE_COUNT = 1; // flag on the first bad read — no consecutive requirement
const MODEL_URL = "/models";

// Runs `fn` when the browser is idle so detection never competes with
// recording/UI work on weaker CPUs. Falls back to a short timeout where
// requestIdleCallback isn't supported (e.g. Safari).
function runWhenIdle(fn: () => void) {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) {
    w.requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 0);
  }
}

export function useProctoring({
  videoRef,
  enabled,
  onViolation,
}: UseProctoringOptions) {
  const [modelsReady, setModelsReady] = useState(false);
  const [fullscreenLost, setFullscreenLost] = useState(false);
  const violatedRef = useRef(false);
  const badFaceStreakRef = useRef(0);

  const triggerViolation = (violation: ProctoringViolation) => {
    if (violatedRef.current) return;
    violatedRef.current = true;
    onViolation(violation);
  };

  // Load face-api models once
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const faceapi = await import("face-api.js");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        if (!cancelled) setModelsReady(true);
      } catch {
        // If models fail to load, proctoring silently degrades to
        // tab-switch/screen-share checks only.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Periodic multi-face detection on the live webcam feed. Self-scheduling
  // (rather than setInterval) so a slow detection on a weak CPU never
  // overlaps with the next one, and each run happens during browser idle
  // time so it doesn't compete with recording/UI work.
  useEffect(() => {
    if (!enabled || !modelsReady) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let faceapiMod: typeof import("face-api.js") | null = null;

    const runDetection = async () => {
      if (cancelled || violatedRef.current) return;
      const video = videoRef.current;

      if (video && video.readyState >= 2) {
        try {
          if (!faceapiMod) faceapiMod = await import("face-api.js");
          const detections = await faceapiMod.detectAllFaces(
            video,
            new faceapiMod.TinyFaceDetectorOptions({
              inputSize: FACE_DETECTOR_INPUT_SIZE,
            }),
          );

          if (detections.length >= 2) {
            badFaceStreakRef.current += 1;
            if (badFaceStreakRef.current >= MULTI_FACE_GRACE_COUNT) {
              triggerViolation("multiple-faces");
            }
          } else {
            badFaceStreakRef.current = 0;
          }
        } catch {
          // Ignore transient detection errors (e.g. video not ready yet)
        }
      }

      if (!cancelled && !violatedRef.current) {
        timeoutId = setTimeout(
          () => runWhenIdle(runDetection),
          FACE_CHECK_INTERVAL_MS,
        );
      }
    };

    timeoutId = setTimeout(() => runWhenIdle(runDetection), FACE_CHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, modelsReady]);

  // Tab-switch / window-blur detection
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) triggerViolation("tab-switch");
    };
    const handleBlur = () => {
      triggerViolation("tab-switch");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Screen-share detection: intercept getDisplayMedia so that starting a
  // screen/tab/window share while the interview is live is caught.
  useEffect(() => {
    if (!enabled) return;
    if (!navigator.mediaDevices?.getDisplayMedia) return;

    const original = navigator.mediaDevices.getDisplayMedia.bind(
      navigator.mediaDevices,
    );

    navigator.mediaDevices.getDisplayMedia = async (
      ...args: Parameters<typeof original>
    ) => {
      triggerViolation("screen-share");
      throw new DOMException(
        "Screen sharing is disabled during the interview.",
        "NotAllowedError",
      );
    };

    return () => {
      navigator.mediaDevices.getDisplayMedia = original;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Fullscreen enforcement: leaving fullscreen (Esc, F11, etc.) doesn't
  // cancel the interview outright — it's not proof of cheating the way a
  // tab-switch or a second face is — but the candidate must return to
  // fullscreen before continuing. `fullscreenLost` drives a blocking
  // overlay in the UI; `enterFullscreen` is what its button calls.
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      setFullscreenLost(!document.fullscreenElement);
    };

    setFullscreenLost(!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [enabled]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {
      // Some browsers reject this outside a direct user gesture; the
      // overlay stays up and the button can just be pressed again.
    });
  };

  return { fullscreenLost, enterFullscreen };
}
