// ========================================
// Main App Layout (with Sidebar + Mobile Nav)
// ========================================

import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader, MobileNav } from "@/components/layout/mobile-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <MobileHeader />
      <Sidebar />
      <main className="lg:pl-[256px] min-h-screen pb-20 lg:pb-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
