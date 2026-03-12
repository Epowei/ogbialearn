// ========================================
// OgbiaLearn - Seed Data
// Ogbia Language Vocabulary & Lesson Structure
// ========================================

import { VocabularyWord, Course } from "./schema";

// ---- Audio Base URL ----
// Local dev: serves from /public/audio/ (default)
// Production: set NEXT_PUBLIC_AUDIO_BASE_URL in Vercel env vars
const AUDIO_BASE = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || "audio/audio";

function audioUrl(filename: string): string {
  return `${AUDIO_BASE}/${filename}`;
}

// ---- Vocabulary Database ----
export const vocabulary: VocabularyWord[] = [
  // Body Parts
  { id: "word_ear", english: "Ear", ogbia: "Ato", audioSrc: audioUrl("ear.mp3"), category: "body" },
  { id: "word_eye", english: "Eye", ogbia: "Adien", audioSrc: audioUrl("eye.mp3"), category: "body" },
  { id: "word_hair", english: "Hair", ogbia: "Asiàl", audioSrc: audioUrl("hair.mp3"), category: "body" },
  { id: "word_hand", english: "Hand", ogbia: "Aguo", audioSrc: audioUrl("hand.mp3"), category: "body" },
  { id: "word_head", english: "Head", ogbia: "Emù", audioSrc: audioUrl("head.mp3"), category: "body" },
  { id: "word_leg", english: "Leg", ogbia: "Àlike", audioSrc: audioUrl("leg.mp3"), category: "body" },
  { id: "word_mouth", english: "Mouth", ogbia: "Ọnù", audioSrc: audioUrl("mouth.mp3"), category: "body" },
  { id: "word_nose", english: "Nose", ogbia: "Izon", audioSrc: audioUrl("nose.mp3"), category: "body" },
  { id: "word_stomach", english: "Stomach", ogbia: "Ewunu", audioSrc: audioUrl("stomach.mp3"), category: "body" },
  { id: "word_teeth", english: "Teeth", ogbia: "Álai", audioSrc: audioUrl("teeth.mp3"), category: "body" },
  { id: "word_tongue", english: "Tongue", ogbia: "Ànem", audioSrc: audioUrl("tongue.mp3"), category: "body" },

  // Household Items
  { id: "word_bed", english: "Bed", ogbia: "Agbàdà", audioSrc: audioUrl("bed.mp3"), category: "household" },
  { id: "word_bottle", english: "Bottle", ogbia: "Òlòlò", audioSrc: audioUrl("bottle.mp3"), category: "household" },
  { id: "word_chair", english: "Chair", ogbia: "O'bakù", audioSrc: audioUrl("chair.mp3"), category: "household" },
  { id: "word_knife", english: "Knife", ogbia: "O'gya", audioSrc: audioUrl("knife.mp3"), category: "household" },
  { id: "word_plate", english: "Plate", ogbia: "Èfèrè", audioSrc: audioUrl("plate.mp3"), category: "household" },
  { id: "word_pot", english: "Pot", ogbia: "O'gbèlè", audioSrc: audioUrl("pot.mp3"), category: "household" },
  { id: "word_spoon", english: "Spoon", ogbia: "Ìngìasì", audioSrc: audioUrl("spoon.mp3"), category: "household" },

  // Animals
  { id: "word_bird", english: "Bird", ogbia: "ẹnùrù", audioSrc: audioUrl("animals/bird.mp3"), category: "animal" },
  { id: "word_butterfly", english: "Butterfly", ogbia: "òbhòrìbhò", audioSrc: audioUrl("animals/butterfly.mp3"), category: "animal" },
  { id: "word_cat", english: "Cat", ogbia: "òlògbò", audioSrc: audioUrl("animals/cat.mp3"), category: "animal" },
  { id: "word_cow", english: "Cow", ogbia: "òvì", audioSrc: audioUrl("animals/cow.mp3"), category: "animal" },
  { id: "word_dog", english: "Dog", ogbia: "àghòḅò", audioSrc: audioUrl("animals/dog.mp3"), category: "animal" },
  { id: "word_elephant", english: "Elephant", ogbia: "òbẹnàm", audioSrc: audioUrl("animals/elephant.mp3"), category: "animal" },
  { id: "word_female_goat", english: "Female Goat", ogbia: "ẹzé", audioSrc: audioUrl("animals/female_goat.mp3"), category: "animal" },
  { id: "word_fish", english: "Fish", ogbia: "ènà", audioSrc: audioUrl("animals/fish.mp3"), category: "animal" },
  { id: "word_fly", english: "Fly", ogbia: "ẹgì", audioSrc: audioUrl("animals/fly.mp3"), category: "animal" },
  { id: "word_lizard", english: "Lizard", ogbia: "àdùgbègbèm", audioSrc: audioUrl("animals/lizard.mp3"), category: "animal" },
  { id: "word_male_goat", english: "Male Goat", ogbia: "èkpè", audioSrc: audioUrl("animals/male_goat.mp3"), category: "animal" },
  { id: "word_millipede", english: "Millipede", ogbia: "ẹnómòtì", audioSrc: audioUrl("animals/millipede.mp3"), category: "animal" },
  { id: "word_monkey", english: "Monkey", ogbia: "ọbù", audioSrc: audioUrl("animals/monkey.mp3"), category: "animal" },
  { id: "word_rat", english: "Rat", ogbia: "òkàtà", audioSrc: audioUrl("animals/rat.mp3"), category: "animal" },
  { id: "word_sheep", english: "Sheep", ogbia: "ọnáánà", audioSrc: audioUrl("animals/sheep.mp3"), category: "animal" },
  { id: "word_snake", english: "Snake", ogbia: "ọkárábhábhár", audioSrc: audioUrl("animals/snake.mp3"), category: "animal" },
  { id: "word_tortoise", english: "Tortoise", ogbia: "àḍùùlè", audioSrc: audioUrl("animals/tortoise.mp3"), category: "animal" },

  // Colors
  { id: "word_ash", english: "Ash", ogbia: "àḍiènẹḅúrú", audioSrc: audioUrl("colors/ash.mp3"), category: "color" },
  { id: "word_black", english: "Black", ogbia: "ọzúzú", audioSrc: audioUrl("colors/black.mp3"), category: "color" },
  { id: "word_blue", english: "Blue", ogbia: "àbulù", audioSrc: audioUrl("colors/blue.mp3"), category: "color" },
  { id: "word_brown", english: "Brown", ogbia: "yèryèr", audioSrc: audioUrl("colors/brown.mp3"), category: "color" },
  { id: "word_green", english: "Green", ogbia: "nyíù", audioSrc: audioUrl("colors/green.mp3"), category: "color" },
  { id: "word_orange", english: "Orange", ogbia: "òlògẹlélényidè", audioSrc: audioUrl("colors/orange.mp3"), category: "color" },
  { id: "word_pink", english: "Pink", ogbia: "àḍiénọgúrú", audioSrc: audioUrl("colors/pink.mp3"), category: "color" },
  { id: "word_purple", english: "Purple", ogbia: "ọḅáḅám-àbùlù", audioSrc: audioUrl("colors/purple.mp3"), category: "color" },
  { id: "word_red", english: "Red", ogbia: "ọḅáḅám", audioSrc: audioUrl("colors/red.mp3"), category: "color" },
  { id: "word_white", english: "White", ogbia: "ọḅáḅá", audioSrc: audioUrl("colors/white.mp3"), category: "color" },
  { id: "word_yellow", english: "Yellow", ogbia: "ạḅekẹ̀", audioSrc: audioUrl("colors/yellow.mp3"), category: "color" },
];

// Helper: get random wrong options from vocabulary
function getRandomOptions(
  correctWord: VocabularyWord,
  allWords: VocabularyWord[],
  count: number = 3
): VocabularyWord[] {
  const others = allWords.filter((w) => w.id !== correctWord.id);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ---- Build Challenges from Vocabulary ----
function buildSelectChallenge(word: VocabularyWord, order: number, lessonId: string) {
  const wrongWords = getRandomOptions(word, vocabulary, 3);
  const options = [
    { id: `${word.id}_correct`, text: word.ogbia, correct: true, audioSrc: word.audioSrc },
    ...wrongWords.map((w, i) => ({
      id: `${word.id}_wrong_${i}`,
      text: w.ogbia,
      correct: false,
      audioSrc: w.audioSrc,
    })),
  ].sort(() => Math.random() - 0.5);

  return {
    id: `challenge_select_${word.id}`,
    lessonId,
    type: "SELECT" as const,
    question: `What is "${word.english}" in Ogbia?`,
    order,
    options,
    audioSrc: word.audioSrc,
  };
}

function buildAssistChallenge(word: VocabularyWord, order: number, lessonId: string) {
  const wrongWords = getRandomOptions(word, vocabulary, 3);
  const options = [
    { id: `${word.id}_correct_assist`, text: word.english, correct: true },
    ...wrongWords.map((w, i) => ({
      id: `${word.id}_wrong_assist_${i}`,
      text: w.english,
      correct: false,
    })),
  ].sort(() => Math.random() - 0.5);

  return {
    id: `challenge_assist_${word.id}`,
    lessonId,
    type: "ASSIST" as const,
    question: `What does "${word.ogbia}" mean in English?`,
    order,
    options,
    audioSrc: word.audioSrc,
  };
}

function buildListeningChallenge(word: VocabularyWord, order: number, lessonId: string) {
  const wrongWords = getRandomOptions(word, vocabulary, 3);
  const options = [
    { id: `${word.id}_correct_listen`, text: word.ogbia, correct: true, audioSrc: word.audioSrc },
    ...wrongWords.map((w, i) => ({
      id: `${word.id}_wrong_listen_${i}`,
      text: w.ogbia,
      correct: false,
      audioSrc: w.audioSrc,
    })),
  ].sort(() => Math.random() - 0.5);

  return {
    id: `challenge_listen_${word.id}`,
    lessonId,
    type: "LISTENING" as const,
    question: "Listen and select the correct word",
    order,
    options,
    audioSrc: word.audioSrc,
  };
}

// ---- Course Data ----

const bodyWords = vocabulary.filter((w) => w.category === "body");
const householdWords = vocabulary.filter((w) => w.category === "household");
const animalWords = vocabulary.filter((w) => w.category === "animal");
const colorWords = vocabulary.filter((w) => w.category === "color");

export const courses: Course[] = [
  {
    id: "course_ogbia",
    title: "Ogbia",
    slug: "ogbia",
    imageSrc: "/ogbia_flag.svg",
    units: [
      {
        id: "unit_1",
        courseId: "course_ogbia",
        title: "Body Parts",
        description: "Learn the names of body parts in Ogbia",
        order: 1,
        color: "#58CC02",
        lessons: [
          {
            id: "lesson_1_1",
            unitId: "unit_1",
            title: "Head & Face",
            order: 1,
            challenges: [
              buildSelectChallenge(bodyWords.find((w) => w.english === "Head")!, 1, "lesson_1_1"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Eye")!, 2, "lesson_1_1"),
              buildSelectChallenge(bodyWords.find((w) => w.english === "Ear")!, 3, "lesson_1_1"),
              buildListeningChallenge(bodyWords.find((w) => w.english === "Nose")!, 4, "lesson_1_1"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Mouth")!, 5, "lesson_1_1"),
            ],
          },
          {
            id: "lesson_1_2",
            unitId: "unit_1",
            title: "More Face Parts",
            order: 2,
            challenges: [
              buildSelectChallenge(bodyWords.find((w) => w.english === "Hair")!, 1, "lesson_1_2"),
              buildListeningChallenge(bodyWords.find((w) => w.english === "Teeth")!, 2, "lesson_1_2"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Tongue")!, 3, "lesson_1_2"),
              buildSelectChallenge(bodyWords.find((w) => w.english === "Head")!, 4, "lesson_1_2"),
              buildListeningChallenge(bodyWords.find((w) => w.english === "Eye")!, 5, "lesson_1_2"),
            ],
          },
          {
            id: "lesson_1_3",
            unitId: "unit_1",
            title: "Body",
            order: 3,
            challenges: [
              buildSelectChallenge(bodyWords.find((w) => w.english === "Hand")!, 1, "lesson_1_3"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Leg")!, 2, "lesson_1_3"),
              buildListeningChallenge(bodyWords.find((w) => w.english === "Stomach")!, 3, "lesson_1_3"),
              buildSelectChallenge(bodyWords.find((w) => w.english === "Leg")!, 4, "lesson_1_3"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Hand")!, 5, "lesson_1_3"),
            ],
          },
          {
            id: "lesson_1_4",
            unitId: "unit_1",
            title: "Review: All Body Parts",
            order: 4,
            challenges: [
              buildListeningChallenge(bodyWords.find((w) => w.english === "Head")!, 1, "lesson_1_4"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Stomach")!, 2, "lesson_1_4"),
              buildSelectChallenge(bodyWords.find((w) => w.english === "Teeth")!, 3, "lesson_1_4"),
              buildListeningChallenge(bodyWords.find((w) => w.english === "Tongue")!, 4, "lesson_1_4"),
              buildAssistChallenge(bodyWords.find((w) => w.english === "Hair")!, 5, "lesson_1_4"),
            ],
          },
        ],
      },
      {
        id: "unit_2",
        courseId: "course_ogbia",
        title: "Household Items",
        description: "Learn common household items in Ogbia",
        order: 2,
        color: "#CE82FF",
        lessons: [
          {
            id: "lesson_2_1",
            unitId: "unit_2",
            title: "Kitchen Items",
            order: 1,
            challenges: [
              buildSelectChallenge(householdWords.find((w) => w.english === "Pot")!, 1, "lesson_2_1"),
              buildAssistChallenge(householdWords.find((w) => w.english === "Plate")!, 2, "lesson_2_1"),
              buildListeningChallenge(householdWords.find((w) => w.english === "Spoon")!, 3, "lesson_2_1"),
              buildSelectChallenge(householdWords.find((w) => w.english === "Knife")!, 4, "lesson_2_1"),
              buildAssistChallenge(householdWords.find((w) => w.english === "Bottle")!, 5, "lesson_2_1"),
            ],
          },
          {
            id: "lesson_2_2",
            unitId: "unit_2",
            title: "Furniture & More",
            order: 2,
            challenges: [
              buildSelectChallenge(householdWords.find((w) => w.english === "Bed")!, 1, "lesson_2_2"),
              buildAssistChallenge(householdWords.find((w) => w.english === "Chair")!, 2, "lesson_2_2"),
              buildListeningChallenge(householdWords.find((w) => w.english === "Bottle")!, 3, "lesson_2_2"),
              buildSelectChallenge(householdWords.find((w) => w.english === "Plate")!, 4, "lesson_2_2"),
              buildListeningChallenge(householdWords.find((w) => w.english === "Knife")!, 5, "lesson_2_2"),
            ],
          },
          {
            id: "lesson_2_3",
            unitId: "unit_2",
            title: "Review: All Household",
            order: 3,
            challenges: [
              buildListeningChallenge(householdWords.find((w) => w.english === "Pot")!, 1, "lesson_2_3"),
              buildSelectChallenge(householdWords.find((w) => w.english === "Spoon")!, 2, "lesson_2_3"),
              buildAssistChallenge(householdWords.find((w) => w.english === "Bed")!, 3, "lesson_2_3"),
              buildListeningChallenge(householdWords.find((w) => w.english === "Chair")!, 4, "lesson_2_3"),
              buildSelectChallenge(householdWords.find((w) => w.english === "Knife")!, 5, "lesson_2_3"),
            ],
          },
        ],
      },
      {
        id: "unit_3",
        courseId: "course_ogbia",
        title: "Animals",
        description: "Learn the names of animals in Ogbia",
        order: 3,
        color: "#FF9600",
        lessons: [
          {
            id: "lesson_3_1",
            unitId: "unit_3",
            title: "Domestic Animals",
            order: 1,
            challenges: [
              buildSelectChallenge(animalWords.find((w) => w.english === "Dog")!, 1, "lesson_3_1"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Cat")!, 2, "lesson_3_1"),
              buildSelectChallenge(animalWords.find((w) => w.english === "Cow")!, 3, "lesson_3_1"),
              buildListeningChallenge(animalWords.find((w) => w.english === "Sheep")!, 4, "lesson_3_1"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Male Goat")!, 5, "lesson_3_1"),
            ],
          },
          {
            id: "lesson_3_2",
            unitId: "unit_3",
            title: "More Domestic Animals",
            order: 2,
            challenges: [
              buildSelectChallenge(animalWords.find((w) => w.english === "Female Goat")!, 1, "lesson_3_2"),
              buildListeningChallenge(animalWords.find((w) => w.english === "Dog")!, 2, "lesson_3_2"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Cow")!, 3, "lesson_3_2"),
              buildSelectChallenge(animalWords.find((w) => w.english === "Cat")!, 4, "lesson_3_2"),
              buildListeningChallenge(animalWords.find((w) => w.english === "Sheep")!, 5, "lesson_3_2"),
            ],
          },
          {
            id: "lesson_3_3",
            unitId: "unit_3",
            title: "Wild Animals",
            order: 3,
            challenges: [
              buildSelectChallenge(animalWords.find((w) => w.english === "Elephant")!, 1, "lesson_3_3"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Monkey")!, 2, "lesson_3_3"),
              buildListeningChallenge(animalWords.find((w) => w.english === "Snake")!, 3, "lesson_3_3"),
              buildSelectChallenge(animalWords.find((w) => w.english === "Tortoise")!, 4, "lesson_3_3"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Lizard")!, 5, "lesson_3_3"),
            ],
          },
          {
            id: "lesson_3_4",
            unitId: "unit_3",
            title: "Small Creatures",
            order: 4,
            challenges: [
              buildSelectChallenge(animalWords.find((w) => w.english === "Bird")!, 1, "lesson_3_4"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Fish")!, 2, "lesson_3_4"),
              buildListeningChallenge(animalWords.find((w) => w.english === "Butterfly")!, 3, "lesson_3_4"),
              buildSelectChallenge(animalWords.find((w) => w.english === "Rat")!, 4, "lesson_3_4"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Fly")!, 5, "lesson_3_4"),
            ],
          },
          {
            id: "lesson_3_5",
            unitId: "unit_3",
            title: "Review: All Animals",
            order: 5,
            challenges: [
              buildListeningChallenge(animalWords.find((w) => w.english === "Elephant")!, 1, "lesson_3_5"),
              buildSelectChallenge(animalWords.find((w) => w.english === "Millipede")!, 2, "lesson_3_5"),
              buildAssistChallenge(animalWords.find((w) => w.english === "Bird")!, 3, "lesson_3_5"),
              buildListeningChallenge(animalWords.find((w) => w.english === "Snake")!, 4, "lesson_3_5"),
              buildSelectChallenge(animalWords.find((w) => w.english === "Fish")!, 5, "lesson_3_5"),
            ],
          },
        ],
      },
      {
        id: "unit_4",
        courseId: "course_ogbia",
        title: "Colors",
        description: "Learn color names in Ogbia",
        order: 4,
        color: "#FF4B4B",
        lessons: [
          {
            id: "lesson_4_1",
            unitId: "unit_4",
            title: "Basic Colors",
            order: 1,
            challenges: [
              buildSelectChallenge(colorWords.find((w) => w.english === "Red")!, 1, "lesson_4_1"),
              buildAssistChallenge(colorWords.find((w) => w.english === "Blue")!, 2, "lesson_4_1"),
              buildSelectChallenge(colorWords.find((w) => w.english === "Green")!, 3, "lesson_4_1"),
              buildListeningChallenge(colorWords.find((w) => w.english === "Yellow")!, 4, "lesson_4_1"),
              buildAssistChallenge(colorWords.find((w) => w.english === "Black")!, 5, "lesson_4_1"),
            ],
          },
          {
            id: "lesson_4_2",
            unitId: "unit_4",
            title: "More Colors",
            order: 2,
            challenges: [
              buildSelectChallenge(colorWords.find((w) => w.english === "White")!, 1, "lesson_4_2"),
              buildAssistChallenge(colorWords.find((w) => w.english === "Orange")!, 2, "lesson_4_2"),
              buildListeningChallenge(colorWords.find((w) => w.english === "Purple")!, 3, "lesson_4_2"),
              buildSelectChallenge(colorWords.find((w) => w.english === "Brown")!, 4, "lesson_4_2"),
              buildAssistChallenge(colorWords.find((w) => w.english === "Pink")!, 5, "lesson_4_2"),
            ],
          },
          {
            id: "lesson_4_3",
            unitId: "unit_4",
            title: "Review: All Colors",
            order: 3,
            challenges: [
              buildListeningChallenge(colorWords.find((w) => w.english === "Red")!, 1, "lesson_4_3"),
              buildSelectChallenge(colorWords.find((w) => w.english === "Ash")!, 2, "lesson_4_3"),
              buildAssistChallenge(colorWords.find((w) => w.english === "Green")!, 3, "lesson_4_3"),
              buildListeningChallenge(colorWords.find((w) => w.english === "Purple")!, 4, "lesson_4_3"),
              buildSelectChallenge(colorWords.find((w) => w.english === "Yellow")!, 5, "lesson_4_3"),
            ],
          },
        ],
      },
    ],
  },
];

// Helper to find a course by slug
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

// Helper to find a lesson by id
export function getLessonById(lessonId: string) {
  for (const course of courses) {
    for (const unit of course.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { lesson, unit, course };
    }
  }
  return null;
}

// Helper to get vocabulary word by english name
export function getWordByEnglish(english: string): VocabularyWord | undefined {
  return vocabulary.find((w) => w.english.toLowerCase() === english.toLowerCase());
}
