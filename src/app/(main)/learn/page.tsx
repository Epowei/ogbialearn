// ========================================
// Learn Page - Main Unit Path
// ========================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Star, Crown } from "lucide-react";
import { courses } from "@/lib/seed";
import { useGameStore } from "@/lib/store";
import { StickyWrapper } from "@/components/layout/sticky-wrapper";
import { GameButton } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function LearnPage() {
  const router = useRouter();
  const { activeCourseId, setActiveCourse, completedLessonIds } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default to first course
    if (!activeCourseId && courses.length > 0) {
      setActiveCourse(courses[0].id);
    }
  }, [activeCourseId, setActiveCourse]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  if (!activeCourse) {
    return (
      <div className="px-6 text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">No Course Selected</h2>
        <GameButton onClick={() => router.push("/courses")}>
          Choose a Course
        </GameButton>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper />

      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-slate-700 mb-8">
          {activeCourse.title} Learning Path
        </h1>

        {activeCourse.units.map((unit) => {
          const completedInUnit = unit.lessons.filter((l) =>
            completedLessonIds.includes(l.id)
          ).length;
          const progress = (completedInUnit / unit.lessons.length) * 100;

          return (
            <div key={unit.id} className="mb-12">
              {/* Unit Header */}
              <div
                className="rounded-2xl p-5 mb-6"
                style={{ backgroundColor: unit.color + "15", borderLeft: `4px solid ${unit.color}` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-700">
                      {unit.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">{unit.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">
                      {completedInUnit}/{unit.lessons.length} lessons
                    </p>
                    <div className="w-32">
                      <ProgressBar value={progress} color="bg-green-500" height="h-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Buttons - Path Style */}
              <div className="relative flex flex-col items-center gap-6">
                {unit.lessons.map((lesson, index) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isFirst = index === 0;
                  const previousCompleted = index > 0 && completedLessonIds.includes(unit.lessons[index - 1].id);
                  const isLocked = !isFirst && !previousCompleted && !isCompleted;
                  const isCurrent = !isCompleted && (isFirst || previousCompleted);

                  // Zigzag offset
                  const offset = index % 2 === 0 ? -40 : 40;

                  return (
                    <div
                      key={lesson.id}
                      className="relative"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      {/* Connector line */}
                      {index > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-slate-200 rounded-full" />
                      )}

                      <button
                        onClick={() => {
                          if (!isLocked) {
                            router.push(`/lesson?id=${lesson.id}`);
                          }
                        }}
                        disabled={isLocked}
                        className={`
                          relative w-[70px] h-[70px] rounded-full
                          flex items-center justify-center
                          border-b-[6px] transition-all
                          ${
                            isCompleted
                              ? "bg-green-500 border-green-600 text-white hover:bg-green-500/90"
                              : isCurrent
                              ? "bg-sky-500 border-sky-600 text-white hover:bg-sky-500/90 lesson-active-pulse"
                              : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <Check size={28} strokeWidth={3} />
                        ) : isLocked ? (
                          <Lock size={24} />
                        ) : index === unit.lessons.length - 1 ? (
                          <Crown size={24} />
                        ) : (
                          <Star size={24} />
                        )}
                      </button>

                      {/* Lesson title label */}
                      <p
                        className={`
                          text-center text-xs font-bold mt-2 max-w-[120px]
                          ${isLocked ? "text-slate-300" : "text-slate-600"}
                        `}
                      >
                        {lesson.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
