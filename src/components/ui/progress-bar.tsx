// ========================================
// Progress Bar Component
// ========================================

"use client";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: string;
}

export function ProgressBar({
  value,
  color = "bg-green-500",
  height = "h-4",
}: ProgressBarProps) {
  return (
    <div className={`relative ${height} w-full rounded-full bg-gray-200 overflow-hidden`}>
      <div
        className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
