// ========================================
// Challenge Card Component
// ========================================

"use client";

import { Challenge, ChallengeOption } from "@/lib/schema";
import { AudioButton } from "@/components/ui/audio-button";
import { Volume2 } from "lucide-react";
import { useEffect } from "react";

interface ChallengeCardProps {
  challenge: Challenge;
  selectedOption: ChallengeOption | null;
  status: "none" | "correct" | "wrong";
  onSelect: (option: ChallengeOption) => void;
  disabled: boolean;
}

export function ChallengeCard({
  challenge,
  selectedOption,
  status,
  onSelect,
  disabled,
}: ChallengeCardProps) {
  // Auto-play correct answer audio when answered (correct or wrong)
  // Use a key combining status + selectedOption to ensure it fires every time
  useEffect(() => {
    if (status === "none") return;

    const correctOption = challenge.options.find((o) => o.correct);

    if (status === "correct" && selectedOption?.audioSrc) {
      const timer = setTimeout(() => {
        const audio = new Audio(selectedOption.audioSrc!);
        audio.play().catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    }

    if (status === "wrong" && correctOption?.audioSrc) {
      const timer = setTimeout(() => {
        const audio = new Audio(correctOption.audioSrc!);
        audio.play().catch(() => {});
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [status, selectedOption?.id, challenge.id]);

  return (
    <div className="w-full">
      {/* Question */}
      <div className="mb-6">
        {challenge.type === "LISTENING" ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-bold text-slate-700">
              {challenge.question}
            </p>
            {challenge.audioSrc && (
              <AudioButton src={challenge.audioSrc} size="lg" />
            )}
          </div>
        ) : challenge.type === "ASSIST" ? (
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-slate-700">
              {challenge.question}
            </p>
            {status === "correct" && challenge.audioSrc && (
              <AudioButton src={challenge.audioSrc} size="sm" />
            )}
          </div>
        ) : (
          /* SELECT type */
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-slate-700">
              {challenge.question}
            </p>
            {status !== "none" && challenge.audioSrc && (
              <AudioButton src={challenge.audioSrc} size="sm" />
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {challenge.options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          const isCorrect = option.correct;

          let borderColor = "border-slate-200 hover:border-sky-400";
          let bgColor = "bg-white hover:bg-sky-50";

          if (status !== "none" && isSelected) {
            if (isCorrect) {
              borderColor = "border-green-500";
              bgColor = "bg-green-50";
            } else {
              borderColor = "border-rose-500";
              bgColor = "bg-rose-50";
            }
          } else if (status === "wrong" && isCorrect) {
            borderColor = "border-green-500";
            bgColor = "bg-green-50";
          } else if (isSelected) {
            borderColor = "border-sky-500";
            bgColor = "bg-sky-50";
          }

          // Only show audio icon on the correct option after answering
          const showAudio =
            option.audioSrc &&
            challenge.type !== "ASSIST" &&
            status !== "none" &&
            isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => !disabled && onSelect(option)}
              disabled={disabled}
              className={`
                flex items-center gap-3 rounded-xl border-2 p-4
                text-left transition-all
                ${borderColor} ${bgColor}
                ${disabled ? "cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"}
                ${status === "wrong" && isSelected ? "animate-shake" : ""}
              `}
            >
              {showAudio && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (option.audioSrc) {
                      const audio = new Audio(option.audioSrc);
                      audio.play().catch(() => {});
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 hover:bg-sky-200 transition-colors"
                >
                  <Volume2 size={14} className="text-sky-600" />
                </button>
              )}
              <span className="text-sm font-semibold text-slate-700 flex-1">
                {option.text}
              </span>
              {status !== "none" && isSelected && (
                <span className="text-lg">
                  {isCorrect ? "✅" : "❌"}
                </span>
              )}
              {status === "wrong" && !isSelected && isCorrect && (
                <span className="text-lg">✅</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
