// ========================================
// Lesson Footer - Check/Continue Button + Status
// ========================================

"use client";

import { GameButton } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface LessonFooterProps {
  status: "none" | "correct" | "wrong" | "completed";
  onCheck: () => void;
  onContinue: () => void;
  disabled: boolean;
  correctAnswer?: string;
}

export function LessonFooter({
  status,
  onCheck,
  onContinue,
  disabled,
  correctAnswer,
}: LessonFooterProps) {
  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 border-t-2 p-4 transition-colors
        ${status === "correct" ? "bg-green-50 border-green-300" : ""}
        ${status === "wrong" ? "bg-rose-50 border-rose-300" : ""}
        ${status === "none" ? "bg-white" : ""}
        ${status === "completed" ? "bg-green-50 border-green-300" : ""}
      `}
    >
      <div className="max-w-[600px] mx-auto flex items-center justify-between">
        {status === "correct" && (
          <div className="flex items-center gap-3">
            <CheckCircle size={32} className="text-green-500" />
            <div>
              <p className="text-lg font-bold text-green-600">Nicely done!</p>
              <p className="text-sm text-green-500">+10 XP</p>
            </div>
          </div>
        )}

        {status === "wrong" && (
          <div className="flex items-center gap-3">
            <XCircle size={32} className="text-rose-500" />
            <div>
              <p className="text-lg font-bold text-rose-600">Incorrect</p>
              {correctAnswer && (
                <p className="text-sm text-rose-500">
                  Correct answer: <strong>{correctAnswer}</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {status === "none" && <div />}

        {status === "completed" && (
          <div className="flex items-center gap-3">
            <CheckCircle size={32} className="text-green-500" />
            <div>
              <p className="text-lg font-bold text-green-600">
                Lesson Complete! 🎉
              </p>
            </div>
          </div>
        )}

        <div>
          {status === "none" && (
            <GameButton onClick={onCheck} disabled={disabled}>
              Check
            </GameButton>
          )}
          {(status === "correct" || status === "wrong") && (
            <GameButton
              onClick={onContinue}
              variant={status === "correct" ? "primary" : "danger"}
            >
              Continue
            </GameButton>
          )}
          {status === "completed" && (
            <GameButton onClick={onContinue} variant="primary" size="lg">
              Finish
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}
