// ========================================
// Courses Page - Select a language course
// ========================================

"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { courses } from "@/lib/seed";
import { useGameStore } from "@/lib/store";
import { GameButton } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function CoursesPage() {
  const router = useRouter();
  const { activeCourseId, setActiveCourse } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[912px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold text-slate-700 mb-2">
        Language Courses
      </h1>
      <p className="text-slate-500 mb-8">Choose a language to learn</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courses.map((course) => {
          const isActive = activeCourseId === course.id;
          return (
            <button
              key={course.id}
              onClick={() => {
                setActiveCourse(course.id);
                router.push("/learn");
              }}
              className={`
                relative rounded-2xl border-2 p-6 text-left transition-all
                hover:shadow-md
                ${
                  isActive
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                    : "border-slate-200 hover:border-slate-300"
                }
              `}
            >
              {isActive && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              )}

              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                <span className="text-white text-3xl font-extrabold">
                  {course.title.charAt(0)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-700">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {course.units.length} units &middot;{" "}
                {course.units.reduce((acc, u) => acc + u.lessons.length, 0)} lessons
              </p>
            </button>
          );
        })}

        {/* Coming Soon Card */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-slate-400 text-3xl">+</span>
          </div>
          <h3 className="text-lg font-bold text-slate-400">More Coming</h3>
          <p className="text-sm text-slate-400 mt-1">Stay tuned!</p>
        </div>
      </div>

      {activeCourseId && (
        <div className="mt-8 text-center">
          <GameButton onClick={() => router.push("/learn")}>
            Continue Learning
          </GameButton>
        </div>
      )}
    </div>
  );
}
