"use client";

import { Users, MessageCircle, TrendingUp, Plus } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xl border border-border p-2 rounded-lg font-bold text-black dark:text-white">
          строка поиска
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded-lg font-medium hover:bg-accent/80 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Подписаться</span>
        </button>
      </div>
    </div>
  );
}
