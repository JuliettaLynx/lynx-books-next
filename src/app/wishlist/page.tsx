"use client";

import { Heart, Star, Plus } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xl border border-border p-2 rounded-lg font-bold text-black dark:text-white">
          строка поиска + сортировка
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded-lg font-medium hover:bg-accent/80 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Добавить книгу</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"></div>
    </div>
  );
}
