"use client";

import type { ReadingSession } from "@/shared/models/ReadingSession";

interface DayStatsProps {
  sessions: ReadingSession[];
}

export function DayStats({ sessions }: DayStatsProps) {
  const totalSessions = sessions.length;
  const totalPages = sessions.reduce((sum, s) => sum + (s.pagesRead || 0), 0);
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0,
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-muted/20 p-2 rounded-lg text-center">
        <div className="text-xs text-muted-foreground uppercase">Сессии</div>
        <div className="text-base font-semibold">{totalSessions}</div>
      </div>
      <div className="bg-muted/20 p-2 rounded-lg text-center">
        <div className="text-xs text-muted-foreground uppercase">Страниц</div>
        <div className="text-base font-semibold">{totalPages}</div>
      </div>
      <div className="bg-muted/20 p-2 rounded-lg text-center">
        <div className="text-xs text-muted-foreground uppercase">Время</div>
        <div className="text-base font-semibold">{timeStr}</div>
      </div>
    </div>
  );
}
