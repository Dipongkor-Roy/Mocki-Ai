"use client";

import { useEffect, useRef, useState } from "react";

export interface InterviewAnswer {
  question: string;
  transcript: string;
  audioBlob: Blob | null;
  skipped: boolean;
}

interface InterviewSessionProps {
  questions: string[];
  stream: MediaStream;
  onComplete: (answers: InterviewAnswer[]) => void;
}

const QUESTION_SECONDS = 60;

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function InterviewSession({
  questions,
  stream,
  onComplete,
}: InterviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const finalTranscriptRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advancingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const answersRef = useRef<InterviewAnswer[]>([]);

  const isLastQuestion = currentIndex === questions.length - 1;

  // Attach webcam preview
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Per-question countdown timer
  useEffect(() => {
    setSecondsLeft(QUESTION_SECONDS);
    setHasRecorded(false);
    advancingRef.current = false;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const stopRecordingInternals = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const goToNext = (answer: InterviewAnswer) => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    answersRef.current = [...answersRef.current, answer];
    if (currentIndex >= questions.length - 1) {
      onComplete(answersRef.current);
    }

    setIsRecording(false);
    setLiveTranscript("");
    finalTranscriptRef.current = "";
    audioChunksRef.current = [];

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  const finalizeAnswer = (skipped: boolean) => {
    isRecordingRef.current = false;
    stopRecordingInternals();
    const audioBlob =
      audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: "audio/webm" })
        : null;
    goToNext({
      question: questions[currentIndex],
      transcript: skipped ? "" : finalTranscriptRef.current.trim(),
      audioBlob: skipped ? null : audioBlob,
      skipped,
    });
  };

  const handleTimeUp = () => {
    finalizeAnswer(false);
  };

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    finalizeAnswer(true);
  };

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    finalizeAnswer(false);
  };

  const startRecording = () => {
    finalTranscriptRef.current = "";
    audioChunksRef.current = [];
    setLiveTranscript("");

    // Audio recording (raw blob)
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;

    // Live speech-to-text
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (SpeechRecognitionCtor) {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionResultEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcriptPart + " ";
          } else {
            interim += transcriptPart;
          }
        }
        setLiveTranscript(finalTranscriptRef.current + interim);
      };

      recognition.onerror = () => {
        // Non-fatal: keep recording audio even if live STT hiccups
      };

      recognition.onend = () => {
        if (isRecordingRef.current && recognitionRef.current === recognition) {
          try {
            recognition.start();
          } catch {
            // ignore restart race
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    isRecordingRef.current = true;
    setIsRecording(true);
    setHasRecorded(true);
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    finalizeAnswer(false);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isUrgent = secondsLeft <= 10;

  const answeredCount = answersRef.current.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0D16] text-[#E2E5F0]">
      {/* Header bar */}
      <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-[#252A40] bg-[#0E1120] px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold sm:text-sm">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="truncate">Live Interview</span>
          <span className="hidden text-[#6B7299] sm:inline">&middot;</span>
          <span className="hidden font-normal text-[#8E96BB] sm:inline">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
          <span className="hidden text-xs text-[#6B7299] sm:inline">
            Time remaining
          </span>
          <span
            className={`font-mono text-base font-bold tabular-nums sm:text-lg ${
              isUrgent ? "text-red-400" : "text-[#FFB830]"
            }`}
          >
            {timeDisplay}
          </span>
        </div>
      </div>

      {/* Body: stacked on mobile, two columns on desktop */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left — question + transcript */}
        <div className="flex min-h-0 flex-1 flex-col border-[#252A40] p-4 sm:p-7 lg:border-r">
          <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-[#7C6FFF]/25 bg-[#7C6FFF]/12 px-2.5 py-1 text-[11px] font-bold text-[#B0A8FF]">
            ⚙ Interview Question — {currentIndex + 1} of {questions.length}
          </span>

          <h2 className="mb-5 max-w-2xl text-lg font-medium leading-relaxed text-[#E2E5F0] sm:text-xl">
            {questions[currentIndex]}
          </h2>

          <div className="flex min-h-[160px] flex-1 flex-col overflow-hidden rounded-lg border border-[#7C6FFF]/60 bg-[#181C2C] p-4">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#7C6FFF]">
              🎙 Live Transcript
            </span>
            <div className="flex-1 overflow-y-auto text-sm leading-relaxed text-[#8E96BB]">
              {liveTranscript ? (
                <p>
                  {liveTranscript}
                  {isRecording && (
                    <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#7C6FFF] align-middle" />
                  )}
                </p>
              ) : (
                <p className="italic text-[#6B7299]">
                  {isRecording
                    ? "Listening…"
                    : "Press “Record Answer” to begin speaking."}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRecordToggle}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none ${
                isRecording
                  ? "border border-[#FF6B6B]/25 bg-[#FF6B6B]/12 text-[#FF8080]"
                  : "bg-[#7C6FFF] text-white hover:bg-[#6B5FFF]"
              }`}
            >
              {isRecording ? "⏺ Recording — Stop" : "🎤 Record Answer"}
            </button>
            <button
              onClick={handleSkip}
              className="rounded-lg border border-[#252A40] bg-transparent px-4 py-2.5 text-sm font-medium text-[#8E96BB] transition-all hover:bg-white/5"
            >
              ⏭ Skip
            </button>
            <button
              onClick={handleNext}
              disabled={!hasRecorded}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00CFA8]/15 px-5 py-2.5 text-sm font-semibold text-[#00CFA8] transition-all hover:bg-[#00CFA8]/25 disabled:cursor-not-allowed disabled:opacity-30 sm:ml-auto sm:w-auto"
            >
              {isLastQuestion ? "✓ Finish Interview" : "▶ Submit & Next"}
            </button>
          </div>
        </div>

        {/* Right — webcam + signals */}
        <div className="flex w-full flex-shrink-0 flex-col gap-4 border-t border-[#252A40] p-4 sm:p-5 lg:w-[360px] lg:border-t-0 xl:w-[420px]">
          {/* Webcam */}
          <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg border border-[#252A40] bg-[#181C2C] lg:max-w-none">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="aspect-[4/3] w-full scale-x-[-1] object-cover"
            />
            {isRecording && (
              <div className="absolute right-2 top-2 rounded-full bg-[#00CFA8]/90 px-2 py-0.5 text-[9px] font-extrabold text-[#002A1F]">
                RECORDING
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[9px] text-white/80">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isRecording ? "animate-pulse bg-red-500" : "bg-[#6B7299]"
                }`}
              />
              {isRecording ? "Webcam Active" : "Webcam Ready"}
            </div>
          </div>

          {/* Signal tiles */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-[#181C2C] px-2 py-4 text-center">
              <div className="text-2xl font-bold text-[#00CFA8]">
                {answeredCount}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-[#6B7299]">
                Answered
              </div>
            </div>
            <div className="rounded-lg bg-[#181C2C] px-2 py-4 text-center">
              <div className="text-2xl font-bold text-[#FFB830]">
                {questions.length - currentIndex}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-[#6B7299]">
                Remaining
              </div>
            </div>
            <div className="rounded-lg bg-[#181C2C] px-2 py-4 text-center">
              <div className="text-2xl font-bold text-[#B0A8FF]">
                {liveTranscript.trim()
                  ? liveTranscript.trim().split(/\s+/).length
                  : 0}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-[#6B7299]">
                Words
              </div>
            </div>
          </div>

          {/* Question progress dots */}
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wide text-[#6B7299]">
              Question Progress
            </div>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-6 rounded-sm ${
                    i < currentIndex
                      ? "bg-[#00CFA8]"
                      : i === currentIndex
                        ? "bg-[#7C6FFF]"
                        : "bg-[#181C2C]"
                  }`}
                />
              ))}
            </div>
          </div>

          {isLastQuestion && (
            <p className="mt-auto text-center text-[10px] text-[#6B7299]">
              This is the last question
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
