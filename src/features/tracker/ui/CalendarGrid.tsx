"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { DayCell } from "./DayCell";
import type { ReadingSession } from "@/shared/models/ReadingSession";

interface CalendarGridProps {
  year: number;
  month: number;
  sessions: ReadingSession[];
  dailyGoal: number;
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({
  year,
  month,
  sessions,
  dailyGoal,
  onDayClick,
}: CalendarGridProps) {
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, ReadingSession[]>();
    sessions.forEach((s) => {
      const key = format(new Date(s.startDate), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [sessions]);

  const days = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Date[] = [];

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

    let leadingEmpty = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = leadingEmpty - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      result.push(new Date(prevMonthYear, prevMonth, day));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      result.push(new Date(year, month, d));
    }

    const totalCells = result.length;
    const remaining = (7 - (totalCells % 7)) % 7;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      result.push(new Date(nextMonthYear, nextMonth, d));
    }

    return result;
  }, [year, month]);

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
        <div
          key={day}
          className="text-center text-xs font-medium text-muted-foreground py-1"
        >
          {day}
        </div>
      ))}

      {days.map((date, index) => {
        const dateKey = format(date, "yyyy-MM-dd");
        const daySessions = sessionsByDate.get(dateKey) || [];
        const isCurrentMonth = date.getMonth() === month;

        return (
          <DayCell
            key={`${dateKey}-${index}`}
            date={date}
            sessions={daySessions}
            dailyGoal={dailyGoal}
            onClick={onDayClick}
            isCurrentMonth={isCurrentMonth}
          />
        );
      })}
    </div>
  );
}
