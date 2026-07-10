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

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Webcam preview - top right corner */}
      <div className="absolute top-4 right-4 z-10 w-40 sm:w-52 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/20 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-x-[-1]"
        />
        {isRecording && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-semibold text-white">REC</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-16">
        <p className="text-indigo-300 text-sm font-medium tracking-wide mb-4">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <h2 className="text-white text-2xl sm:text-4xl font-semibold text-center max-w-3xl leading-snug">
          {questions[currentIndex]}
        </h2>

        <div
          className={`mt-8 text-5xl font-bold tabular-nums ${
            isUrgent ? "text-red-400" : "text-white"
          }`}
        >
          {timeDisplay}
        </div>
        <p className="text-gray-400 text-xs mt-1">Time remaining</p>

        {liveTranscript && (
          <div className="mt-8 max-w-2xl w-full rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-gray-400 mb-1">Live transcript</p>
            <p className="text-sm text-gray-200">{liveTranscript}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="pb-10 flex items-center justify-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
        >
          Skip / Pass
        </button>
        <button
          onClick={handleRecordToggle}
          className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-all ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
          }`}
        >
          {isRecording ? "⏹ Stop Recording" : "🎤 Record Answer"}
        </button>
        <button
          onClick={handleNext}
          disabled={!hasRecorded}
          className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-green-600"
        >
          {isLastQuestion ? "Finish" : "Next Question →"}
        </button>
      </div>

      {isLastQuestion && (
        <p className="text-center text-gray-500 text-xs pb-4">
          This is the last question
        </p>
      )}
    </div>
  );
}
