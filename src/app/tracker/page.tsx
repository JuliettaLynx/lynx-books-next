"use client";

import { Calendar, TrendingUp, Plus } from "lucide-react";

export default function TrackerPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-center">
        <div className="flex justify-between px-4 w-full md:w-72 py-2 gap-2 bg-bg-secondary border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-accent" />
            <h3 className="text-lg font-semibold text-white">Сегодня</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-black dark:text-white">0</p>
            <p className="text-sm text-text">страниц</p>
          </div>
        </div>
        <button className="flex w-full md:w-48 items-center gap-2 px-4 py-3 bg-accent text-bg-primary rounded-lg font-medium hover:bg-accent/80 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Новая сессия</span>
        </button>
      </div>
    </div>
  );
}
