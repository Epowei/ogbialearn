// ========================================
// Sticky Wrapper - Right Side Stats Panel
// ========================================

"use client";

import { Heart, Zap, Flame } from "lucide-react";
import { useGameStore } from "@/lib/store";

export function StickyWrapper() {
  const { hearts, points, streak } = useGameStore();

  return (
    <div className="hidden lg:block sticky top-6 self-start w-[368px] space-y-4">
      {/* Stats Card */}
      <div className="rounded-2xl border-2 p-4 space-y-4">
        <h3 className="text-lg font-bold text-slate-700">Your Stats</h3>

        {/* Hearts */}
        <div className="flex items-center gap-3">
          <Heart className="text-rose-500 fill-rose-500" size={28} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600">Hearts</p>
          </div>
          <span className="text-lg font-bold text-rose-500">{hearts}</span>
        </div>

        {/* XP Points */}
        <div className="flex items-center gap-3">
          <Zap className="text-amber-500 fill-amber-500" size={28} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600">Total XP</p>
          </div>
          <span className="text-lg font-bold text-amber-500">{points}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3">
          <Flame className="text-orange-500 fill-orange-500" size={28} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600">Day Streak</p>
          </div>
          <span className="text-lg font-bold text-orange-500">{streak}</span>
        </div>
      </div>

      {/* Quick Vocabulary */}
      <div className="rounded-2xl border-2 p-4">
        <h3 className="text-lg font-bold text-slate-700 mb-3">Quick Words</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Head</span>
            <span className="font-semibold text-green-600">Emù</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Eye</span>
            <span className="font-semibold text-green-600">Adien</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Hand</span>
            <span className="font-semibold text-green-600">Aguo</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Pot</span>
            <span className="font-semibold text-green-600">O&apos;gbèlè</span>
          </div>
        </div>
      </div>
    </div>
  );
}
