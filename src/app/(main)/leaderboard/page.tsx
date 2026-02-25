// ========================================
// Leaderboard Page (Coming Soon)
// ========================================

import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
      <Trophy size={64} className="text-amber-400 mb-4" />
      <h1 className="text-2xl font-extrabold text-slate-700 mb-2">
        Leaderboard
      </h1>
      <p className="text-slate-500 max-w-md">
        Coming soon! Complete lessons and earn XP to climb the leaderboard.
      </p>
    </div>
  );
}
