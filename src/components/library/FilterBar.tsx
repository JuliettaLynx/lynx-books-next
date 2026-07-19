"use client";

import { Heart, Bookmark, BookmarkCheck } from "lucide-react";
import { BookStatus } from "@/models/Book";

type StatusFilter = "все" | BookStatus;
type FavoriteFilter = "все" | "избранное" | "не избранное";

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusFilter: (filter: StatusFilter) => void;
  favoriteFilter: FavoriteFilter;
  onFavoriteFilter: (filter: FavoriteFilter) => void;
}

const statusOptions: { value: StatusFilter; label: string; active: boolean }[] =
  [
    { value: "все", label: "Все", active: true },
    { value: "прочитано", label: "Прочитано", active: false },
    { value: "не прочитано", label: "Не прочитано", active: false },
    { value: "брошено", label: "Брошено", active: false },
  ];

export function FilterBar({
  statusFilter,
  onStatusFilter,
  favoriteFilter,
  onFavoriteFilter,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Фильтр по статусу */}
      <div className="flex gap-1 flex-wrap">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-accent text-bg-primary"
                : "bg-bg-secondary text-text hover:bg-border/40"
            }`}
          >
            {opt.label}
          </button>
        ))}

        {/* Разделитель */}
        <div className="w-px h-6 bg-border block mx-2 my-1" />

        {/* Фильтр по избранному */}
        <div className="flex gap-1">
          <button
            onClick={() => onFavoriteFilter("все")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              favoriteFilter === "все"
                ? "bg-accent text-bg-primary"
                : "bg-bg-secondary text-text hover:bg-border/40"
            }`}
            title="Показать все"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">Все</span>
          </button>
          <button
            onClick={() => onFavoriteFilter("избранное")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              favoriteFilter === "избранное"
                ? "bg-accent text-bg-primary"
                : "bg-bg-secondary text-text hover:bg-border/40"
            }`}
            title="Показать избранные"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span className="hidden md:inline">Избранное</span>
          </button>
          <button
            onClick={() => onFavoriteFilter("не избранное")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              favoriteFilter === "не избранное"
                ? "bg-accent text-bg-primary"
                : "bg-bg-secondary text-text hover:bg-border/40"
            }`}
            title="Показать не избранные"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden md:inline">Не избранное</span>
          </button>
        </div>
      </div>
    </div>
  );
}
