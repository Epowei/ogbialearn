// ========================================
// OgbiaLearn - Game State Store (Zustand)
// ========================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  // User Stats
  hearts: number;
  points: number;
  streak: number;
  activeCourseId: string | null;
  completedLessonIds: string[];

  // Actions
  setActiveCourse: (courseId: string) => void;
  addPoints: (amount: number) => void;
  removeHeart: () => void;
  refillHearts: () => void;
  completeLesson: (lessonId: string) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
}

export const MAX_HEARTS = 5;
export const POINTS_PER_CORRECT = 10;
export const LESSON_COMPLETE_BONUS = 25;

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hearts: MAX_HEARTS,
      points: 0,
      streak: 0,
      activeCourseId: null,
      completedLessonIds: [],

      setActiveCourse: (courseId) => set({ activeCourseId: courseId }),

      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),

      removeHeart: () =>
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
        })),

      refillHearts: () => set({ hearts: MAX_HEARTS }),

      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
          points: state.points + LESSON_COMPLETE_BONUS,
        })),

      incrementStreak: () =>
        set((state) => ({ streak: state.streak + 1 })),

      resetProgress: () =>
        set({
          hearts: MAX_HEARTS,
          points: 0,
          streak: 0,
          activeCourseId: null,
          completedLessonIds: [],
        }),
    }),
    {
      name: "ogbialearn-game-state",
    }
  )
);
