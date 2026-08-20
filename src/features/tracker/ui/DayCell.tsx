"use client";

import { cn } from "@/shared/lib/utils";
import type { ReadingSession } from "@/shared/models/ReadingSession";

interface DayCellProps {
  date: Date;
  sessions: ReadingSession[];
  dailyGoal: number;
  onClick: (date: Date) => void;
  isCurrentMonth: boolean;
}

export function DayCell({
  date,
  sessions,
  dailyGoal,
  onClick,
  isCurrentMonth,
}: DayCellProps) {
  const day = date.getDate();
  const totalPages = sessions.reduce((sum, s) => sum + (s.pagesRead || 0), 0);
  const hasSessions = sessions.length > 0;
  const progress = Math.min((totalPages / dailyGoal) * 100, 100);

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "relative flex items-center justify-center p-1 rounded-lg border bg-card/40 transition-all hover:scale-105 overflow-hidden",
        "w-full aspect-1/2 sm:aspect-2/1",
        isCurrentMonth ? "" : "text-muted-foreground",
        !isCurrentMonth && "opacity-30",
      )}
    >
      <div
        className="absolute inset-0 hidden sm:block pointer-events-none transition-[clip-path] duration-300 ease-out"
        style={{
          background:
            "linear-gradient(to right, var(--chart-1), var(--chart-2), var(--chart-3))",
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
        }}
      />

      <div
        className="absolute inset-0 block sm:hidden pointer-events-none transition-[clip-path] duration-300 ease-out"
        style={{
          background:
            "linear-gradient(to top, var(--chart-1), var(--chart-2), var(--chart-3))",
          clipPath: `inset(${100 - progress}% 0 0 0)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <span className="text-sm font-medium leading-none">{day}</span>
        {hasSessions && (
          <span className="text-[10px] text-secondary-foreground mt-0.5">
            {totalPages} стр.
          </span>
        )}
      </div>
    </button>
  );
}
