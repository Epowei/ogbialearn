// ========================================
// Custom 3D Game-Style Button
// ========================================

"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "primaryOutline" | "secondary" | "secondaryOutline" | "danger" | "dangerOutline" | "super" | "ghost" | "sidebar" | "sidebarOutline" | "locked";
type Size = "default" | "sm" | "lg" | "icon" | "rounded";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-green-500 text-white border-green-600 border-b-4 active:border-b-0 hover:bg-green-500/90",
  primaryOutline:
    "bg-white text-green-500 border-green-500/30 hover:bg-green-50",
  secondary:
    "bg-sky-400 text-white border-sky-500 border-b-4 active:border-b-0 hover:bg-sky-400/90",
  secondaryOutline:
    "bg-white text-sky-500 border-sky-500/30 hover:bg-sky-50",
  danger:
    "bg-rose-500 text-white border-rose-600 border-b-4 active:border-b-0 hover:bg-rose-500/90",
  dangerOutline:
    "bg-white text-rose-500 border-rose-500/30 hover:bg-rose-50",
  super:
    "bg-indigo-500 text-white border-indigo-600 border-b-4 active:border-b-0 hover:bg-indigo-500/90",
  ghost:
    "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",
  sidebar:
    "bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-none",
  sidebarOutline:
    "bg-transparent text-slate-500 border-2 border-slate-200 hover:bg-slate-100 transition-none",
  locked:
    "bg-neutral-200 text-neutral-400 border-neutral-300 border-b-4 active:border-b-0 cursor-not-allowed",
};

const sizeClasses: Record<Size, string> = {
  default: "h-11 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-12 px-8",
  icon: "h-10 w-10",
  rounded: "rounded-full",
};

const GameButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-xl
          text-sm font-bold uppercase tracking-wide
          border-2 transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      />
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };
export type { ButtonProps };
