// ========================================
// OgbiaLearn - Data Schema
// ========================================

export type ChallengeType = "SELECT" | "ASSIST" | "LISTENING";

export interface VocabularyWord {
  id: string;
  english: string;
  ogbia: string;
  audioSrc: string; // path relative to /public
  category: "body" | "household" | "greeting" | "nature" | "food" | "general";
  imageSrc?: string;
}

export interface ChallengeOption {
  id: string;
  text: string;
  correct: boolean;
  audioSrc?: string;
}

export interface Challenge {
  id: string;
  lessonId: string;
  type: ChallengeType;
  question: string;
  order: number;
  options: ChallengeOption[];
  audioSrc?: string; // for LISTENING type
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  order: number;
  challenges: Challenge[];
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  color: string; // tailwind color class
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  imageSrc: string;
  units: Unit[];
}

// User Progress (managed via Zustand store)
export interface UserProgress {
  activeCourseId: string | null;
  hearts: number;
  points: number; // XP
  streak: number;
  completedLessonIds: string[];
  completedChallengeIds: string[];
}
