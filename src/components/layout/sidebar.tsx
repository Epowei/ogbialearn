// ========================================
// Sidebar Navigation
// ========================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  ShoppingBag,
  Bot,
} from "lucide-react";

const sidebarItems = [
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Courses", href: "/courses", icon: GraduationCap },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex h-full w-[256px] flex-col border-r-2 px-4 fixed left-0 top-0">
      {/* Logo */}
      <Link href="/learn" className="flex items-center gap-x-3 pb-7 pt-8 pl-4">
        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
          <span className="text-white font-extrabold text-lg">O</span>
        </div>
        <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
          OgbiaLearn
        </h1>
      </Link>

      {/* Nav Items */}
      <div className="flex flex-col gap-y-2 flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-x-3 rounded-xl px-4 py-3
                text-sm font-bold transition-colors
                ${
                  isActive
                    ? "bg-sky-500/15 text-sky-500 border-2 border-sky-300"
                    : "text-slate-500 hover:bg-slate-100 border-2 border-transparent"
                }
              `}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
