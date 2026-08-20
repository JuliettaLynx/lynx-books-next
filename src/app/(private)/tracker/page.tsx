"use client";

import { useState, useEffect, useCallback } from "react";
import { getSessionsForMonth } from "@/features/tracker/api/actions";
import type { ReadingSession } from "@/shared/models/ReadingSession";

import { EmptyState } from "@/components/EmptyState";
import { CalendarIcon, LayoutDashboardIcon } from "lucide-react";

import TrackerHeader from "@/features/tracker/ui/TrackerHeader";
import TrackerStats from "@/features/tracker/ui/TrackerStats";

export default function TrackerPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async (y: number, m: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessionsForMonth(y, m);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Не удалось загрузить сессии");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions(year, month);
  }, [year, month, loadSessions]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-3xl font-bold">Трекер</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <TrackerHeader
            year={year}
            month={month}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onYearChange={handleYearChange}
          />

          {loading ? (
            <div className="flex justify-center p-8 text-muted-foreground">
              Загрузка сессий...
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : (
            <>
              <TrackerStats sessions={sessions} year={year} month={month} />
              <EmptyState
                title="Календарь"
                description="Скоро будет добавлен"
                icon={<CalendarIcon className="size-12" />}
                className="w-full min-h-50"
              />
            </>
          )}
        </div>

        <EmptyState
          title="Дашборд"
          description="Аналитика и графики появятся позже"
          icon={<LayoutDashboardIcon className="size-12" />}
          className="w-full min-h-50"
        />
      </div>
    </div>
  );
}
