# OgbiaLearn — Adding New Content Guide

This guide explains how to add new Ogbia words, lessons, units, and audio to the app.

---

## 1. Add Audio Files

Place your `.mp3` (or `.wav`) pronunciation files in:

```
ogbialearn/public/audio/
```

**Naming convention:** Use the lowercase English word as the filename.

```
water.mp3
fire.mp3
mother.mp3
```

These are served at `/audio/water.mp3`, `/audio/fire.mp3`, etc.

---

## 2. Add Vocabulary Words

Open `src/lib/seed.ts` and add entries to the `vocabulary` array:

```typescript
export const vocabulary: VocabularyWord[] = [
  // ... existing words ...

  // New words — add here
  { id: "word_water", english: "Water", ogbia: "Mìnì", audioSrc: "/audio/water.mp3", category: "nature" },
  { id: "word_fire",  english: "Fire",  ogbia: "Erìn", audioSrc: "/audio/fire.mp3",  category: "nature" },
];
```

### Field Reference

| Field      | Description                                | Example                  |
|------------|--------------------------------------------|--------------------------|
| `id`       | Unique ID, format: `word_<english>`        | `"word_water"`           |
| `english`  | English translation (capitalized)          | `"Water"`                |
| `ogbia`    | Ogbia word with correct accent marks       | `"Mìnì"`                |
| `audioSrc` | Path to audio file in `/public/audio/`     | `"/audio/water.mp3"`     |
| `category` | One of the supported categories (see below)| `"nature"`               |

### Supported Categories

- `"body"` — Body parts
- `"household"` — Household items
- `"greeting"` — Greetings & phrases
- `"nature"` — Nature & environment
- `"food"` — Food & drink
- `"general"` — Anything else

You can add new category values by updating the `VocabularyWord` type in `src/lib/schema.ts`.

---

## 3. Add New Lessons

Lessons are added inside a unit's `lessons` array in `src/lib/seed.ts`.

### Three Challenge Builder Functions

The app has helper functions that auto-generate challenges from vocabulary words:

| Function                  | What it does                                         |
|---------------------------|------------------------------------------------------|
| `buildSelectChallenge()`  | "What is ___ in Ogbia?" → pick the correct Ogbia word |
| `buildAssistChallenge()`  | "What does ___ mean in English?" → pick the English   |
| `buildListeningChallenge()` | Play audio → pick the correct Ogbia word            |

### Example: Add a lesson to an existing unit

```typescript
{
  id: "lesson_1_5",          // Unique lesson ID
  unitId: "unit_1",          // Must match the parent unit's ID
  title: "Nature Basics",
  order: 5,                  // Next order number in the unit
  challenges: [
    buildSelectChallenge(vocabulary.find((w) => w.english === "Water")!, 1, "lesson_1_5"),
    buildAssistChallenge(vocabulary.find((w) => w.english === "Fire")!, 2, "lesson_1_5"),
    buildListeningChallenge(vocabulary.find((w) => w.english === "Water")!, 3, "lesson_1_5"),
    buildSelectChallenge(vocabulary.find((w) => w.english === "Fire")!, 4, "lesson_1_5"),
    buildAssistChallenge(vocabulary.find((w) => w.english === "Water")!, 5, "lesson_1_5"),
  ],
},
```

**Each challenge takes 3 arguments:**
1. The `VocabularyWord` object (found from the `vocabulary` array)
2. The `order` number (position within the lesson, starting at 1)
3. The `lessonId` string (must match the lesson's `id`)

**Tip:** Mix all three challenge types in each lesson for variety. Aim for 5 challenges per lesson.

---

## 4. Add New Units

Add a new unit object to the course's `units` array in `src/lib/seed.ts`:

```typescript
{
  id: "unit_3",
  courseId: "course_ogbia",
  title: "Nature",
  description: "Learn nature words in Ogbia",
  order: 3,                  // Next order number
  color: "#FF9500",          // Any hex color for the UI accent
  lessons: [
    {
      id: "lesson_3_1",
      unitId: "unit_3",
      title: "Water & Fire",
      order: 1,
      challenges: [
        // ... use builder functions as shown above
      ],
    },
    // ... more lessons
  ],
},
```

### Suggested Unit Colors

| Color     | Hex       | Used By         |
|-----------|-----------|-----------------|
| Green     | `#58CC02` | Unit 1 (Body)   |
| Purple    | `#CE82FF` | Unit 2 (House)  |
| Orange    | `#FF9500` | Available       |
| Blue      | `#1CB0F6` | Available       |
| Red       | `#FF4B4B` | Available       |
| Pink      | `#FF86D0` | Available       |

---

## 5. Update the AI Tutor

Open `src/app/api/chat/route.ts` and update **two places**:

### a) The `OGBIA_CONTEXT` string (for Google Gemini API)

Add new words to the context prompt so the AI knows about them:

```
NATURE:
- Water = Mìnì
- Fire = Erìn
```

### b) The `vocabulary` object in `handleLocalResponse()` (for fallback)

```typescript
const vocabulary: Record<string, string> = {
  // ... existing words ...
  water: "Mìnì",
  fire: "Erìn",
};
```

---

## Complete Checklist

When adding new content, follow these steps in order:

- [ ] Drop `.mp3` files into `public/audio/`
- [ ] Add word entries to `vocabulary[]` in `src/lib/seed.ts`
- [ ] Filter new words by category (e.g., `const natureWords = vocabulary.filter(w => w.category === "nature")`)
- [ ] Create lessons using builder functions
- [ ] Add lessons to an existing unit or create a new unit
- [ ] Update `OGBIA_CONTEXT` in `src/app/api/chat/route.ts`
- [ ] Update `vocabulary` in `handleLocalResponse()` in the same file
- [ ] Run `npm run dev` and test the new lessons

---

## File Quick Reference

| File | What to Edit |
|------|-------------|
| `public/audio/` | Add `.mp3` pronunciation files |
| `src/lib/seed.ts` | Add words, lessons, units |
| `src/lib/schema.ts` | Add new categories (if needed) |
| `src/app/api/chat/route.ts` | Update AI vocabulary context |

---

## Notes

- Wrong-answer options are **auto-generated** from all words in the `vocabulary` array — the more words you add, the better the distractors become.
- The Learn page **auto-renders** from the data. No UI changes needed for new content.
- Progress tracking works by lesson ID — new lessons are tracked automatically.
- IDs must be unique across the entire app. Use the naming patterns: `word_<english>`, `unit_<n>`, `lesson_<unit>_<n>`, `challenge_<type>_word_<english>`.
