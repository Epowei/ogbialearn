// ========================================
// Shop Page (Coming Soon)
// ========================================

import { ShoppingBag } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
      <ShoppingBag size={64} className="text-sky-400 mb-4" />
      <h1 className="text-2xl font-extrabold text-slate-700 mb-2">Shop</h1>
      <p className="text-slate-500 max-w-md">
        Coming soon! Spend your XP on heart refills, streak freezes, and more.
      </p>
    </div>
  );
}
