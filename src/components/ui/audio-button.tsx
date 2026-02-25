// ========================================
// Audio Playback Button
// ========================================

"use client";

import { Volume2 } from "lucide-react";
import { useState, useCallback } from "react";
import { playAudio } from "@/lib/audio";

interface AudioButtonProps {
  src: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AudioButton({ src, size = "md", className = "" }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  const handlePlay = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    playAudio(src);
    setTimeout(() => setIsPlaying(false), 1500);
  }, [src, isPlaying]);

  return (
    <button
      onClick={handlePlay}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-full
        bg-sky-500 hover:bg-sky-600 active:bg-sky-700
        text-white shadow-md
        transition-all duration-150
        ${isPlaying ? "scale-110 ring-4 ring-sky-300" : ""}
        ${className}
      `}
      aria-label="Play audio"
    >
      <Volume2 size={iconSizes[size]} />
    </button>
  );
}
