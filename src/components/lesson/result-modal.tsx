// ========================================
// Result Modal - Lesson Complete Screen
// ========================================

"use client";

import { useRouter } from "next/navigation";
import { GameButton } from "@/components/ui/button";
import { Trophy, Heart, Zap, Star } from "lucide-react";

interface ResultModalProps {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  heartsLeft: number;
}

export function ResultModal({
  correctCount,
  totalCount,
  xpEarned,
  heartsLeft,
}: ResultModalProps) {
  const router = useRouter();
  const percentage = Math.round((correctCount / totalCount) * 100);
  const isPerfect = correctCount === totalCount;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
        {/* Icon */}
        <div className="mb-6">
          {isPerfect ? (
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
              <Trophy size={48} className="text-amber-500" />
            </div>
          ) : percentage >= 60 ? (
            <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Star size={48} className="text-green-500" />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-sky-100 flex items-center justify-center">
              <Star size={48} className="text-sky-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
          {isPerfect
            ? "Perfect! 🎉"
            : percentage >= 60
            ? "Great Job!"
            : "Keep Practicing!"}
        </h2>
        <p className="text-slate-500 mb-8">
          You got {correctCount} out of {totalCount} correct ({percentage}%)
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-amber-50 p-3">
            <Zap size={24} className="text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-600">{xpEarned}</p>
            <p className="text-xs text-amber-500">XP Earned</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-3">
            <Heart
              size={24}
              className="text-rose-500 mx-auto mb-1 fill-rose-500"
            />
            <p className="text-lg font-bold text-rose-600">{heartsLeft}</p>
            <p className="text-xs text-rose-500">Hearts Left</p>
          </div>
          <div className="rounded-xl bg-green-50 p-3">
            <Star size={24} className="text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600">{percentage}%</p>
            <p className="text-xs text-green-500">Score</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <GameButton
            onClick={() => router.push("/learn")}
            className="w-full"
            size="lg"
          >
            Continue
          </GameButton>
          {percentage < 100 && (
            <GameButton
              onClick={() => window.location.reload()}
              variant="ghost"
              className="w-full"
            >
              Practice Again
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}
