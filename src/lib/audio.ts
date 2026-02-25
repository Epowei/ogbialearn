// ========================================
// Audio utility - plays audio from /public/audio
// ========================================

let currentAudio: HTMLAudioElement | null = null;

export function playAudio(src: string) {
  if (typeof window === "undefined") return;

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);
  currentAudio.play().catch((err) => {
    console.warn("Audio playback failed:", err);
  });
}

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
