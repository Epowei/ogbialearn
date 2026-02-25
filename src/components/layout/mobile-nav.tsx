// ========================================
// Mobile Bottom Navigation + Header
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

const navItems = [
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Courses", href: "/courses", icon: GraduationCap },
  { label: "Board", href: "/leaderboard", icon: Trophy },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "AI", href: "/ai-tutor", icon: Bot },
];

export function MobileHeader() {
  return (
    <div className="lg:hidden flex items-center justify-between bg-green-500 px-6 py-3 sticky top-0 z-50">
      <Link href="/learn" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <span className="text-white font-extrabold text-sm">O</span>
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-wide">
          OgbiaLearn
        </h1>
      </Link>
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl
                text-xs font-bold transition-colors
                ${isActive ? "text-sky-500" : "text-slate-400"}
              `}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
