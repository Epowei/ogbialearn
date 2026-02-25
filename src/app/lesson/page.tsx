// ========================================
// Lesson Page - Interactive Quiz Engine
// ========================================

"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Heart } from "lucide-react";
import { getLessonById } from "@/lib/seed";
import { useGameStore, POINTS_PER_CORRECT } from "@/lib/store";
import { ChallengeOption } from "@/lib/schema";
import { playAudio } from "@/lib/audio";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChallengeCard } from "@/components/lesson/challenge-card";
import { LessonFooter } from "@/components/lesson/lesson-footer";
import { ResultModal } from "@/components/lesson/result-modal";

function LessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id");

  const { hearts, removeHeart, addPoints, completeLesson, refillHearts } =
    useGameStore();

  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ChallengeOption | null>(null);
  const [status, setStatus] = useState<"none" | "correct" | "wrong">("none");
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const lessonData = useMemo(() => {
    if (!lessonId) return null;
    return getLessonById(lessonId);
  }, [lessonId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const challenges = lessonData?.lesson.challenges || [];
  const currentChallenge = challenges[currentIndex];
  const progress = ((currentIndex) / challenges.length) * 100;

  const handleSelect = useCallback((option: ChallengeOption) => {
    if (status !== "none") return;
    setSelectedOption(option);
  }, [status]);

  const handleCheck = useCallback(() => {
    if (!selectedOption) return;

    if (selectedOption.correct) {
      setStatus("correct");
      setCorrectCount((prev) => prev + 1);
      addPoints(POINTS_PER_CORRECT);
      setXpEarned((prev) => prev + POINTS_PER_CORRECT);
      // Play success sound effect would go here
    } else {
      setStatus("wrong");
      removeHeart();
      // Play error sound effect would go here
    }
  }, [selectedOption, addPoints, removeHeart]);

  const handleContinue = useCallback(() => {
    // Check for game over
    if (hearts === 0) {
      refillHearts();
      router.push("/learn");
      return;
    }

    if (currentIndex + 1 >= challenges.length) {
      // Lesson complete
      if (lessonId) {
        completeLesson(lessonId);
      }
      setShowResult(true);
      return;
    }

    // Next challenge
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setStatus("none");
  }, [
    currentIndex,
    challenges.length,
    hearts,
    lessonId,
    completeLesson,
    refillHearts,
    router,
  ]);

  // Auto-play audio for listening challenges
  useEffect(() => {
    if (
      mounted &&
      currentChallenge?.type === "LISTENING" &&
      currentChallenge.audioSrc
    ) {
      const timer = setTimeout(() => {
        playAudio(currentChallenge.audioSrc!);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentChallenge, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">
          Lesson not found
        </h2>
        <button
          onClick={() => router.push("/learn")}
          className="text-sky-500 font-bold hover:underline"
        >
          Back to Learn
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <ResultModal
        correctCount={correctCount}
        totalCount={challenges.length}
        xpEarned={xpEarned}
        heartsLeft={hearts}
      />
    );
  }

  // No hearts left - show game over
  if (hearts === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl">
          <Heart
            size={64}
            className="text-rose-400 mx-auto mb-4"
          />
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Out of Hearts!
          </h2>
          <p className="text-slate-500 mb-6">
            You&apos;ve run out of hearts. Come back later or practice to earn
            more.
          </p>
          <button
            onClick={() => {
              refillHearts();
              router.push("/learn");
            }}
            className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  const correctAnswer = currentChallenge?.options.find((o) => o.correct)?.text;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
        <div className="max-w-[600px] mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/learn")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
          <ProgressBar value={progress} />
          <div className="flex items-center gap-1">
            <Heart
              size={22}
              className="text-rose-500 fill-rose-500"
            />
            <span className="text-sm font-bold text-rose-500">{hearts}</span>
          </div>
        </div>
      </div>

      {/* Challenge Area */}
      <div className="flex-1 flex items-center justify-center px-4 pb-32">
        <div className="max-w-[600px] w-full">
          {/* Challenge type label */}
          <div className="mb-4">
            <span
              className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
                ${
                  currentChallenge.type === "SELECT"
                    ? "bg-green-100 text-green-600"
                    : currentChallenge.type === "ASSIST"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-sky-100 text-sky-600"
                }
              `}
            >
              {currentChallenge.type === "SELECT"
                ? "Select the correct translation"
                : currentChallenge.type === "ASSIST"
                ? "Translate to English"
                : "Listening challenge"}
            </span>
          </div>

          <ChallengeCard
            challenge={currentChallenge}
            selectedOption={selectedOption}
            status={status}
            onSelect={handleSelect}
            disabled={status !== "none"}
          />
        </div>
      </div>

      {/* Footer */}
      <LessonFooter
        status={status}
        onCheck={handleCheck}
        onContinue={handleContinue}
        disabled={!selectedOption}
        correctAnswer={correctAnswer}
      />
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-slate-400">Loading lesson...</div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
