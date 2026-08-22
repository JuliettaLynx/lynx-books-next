"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSessionsForMonth,
  getDailyGoal,
  deleteSession,
} from "@/features/tracker/api/actions";
import type { ReadingSession } from "@/shared/models/ReadingSession";

import { EmptyState } from "@/components/EmptyState";
import { LayoutDashboardIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import TrackerHeader from "@/features/tracker/ui/TrackerHeader";
import TrackerStats from "@/features/tracker/ui/TrackerStats";
import CalendarGrid from "@/features/tracker/ui/CalendarGrid";
import { TrackerSkeleton } from "@/features/tracker/ui/TrackerSkeleton";
import { SessionModal } from "@/features/tracker/ui/SessionModal";
import { DayDetailsModal } from "@/features/tracker/ui/DayDetailsModal";
import { showSuccess, showError } from "@/shared/lib/toast";

export default function TrackerPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number>(50);
  const [goalLoading, setGoalLoading] = useState(true);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sessionToEdit, setSessionToEdit] = useState<ReadingSession | null>(
    null,
  );

  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [editingFromDay, setEditingFromDay] = useState<Date | undefined>(
    undefined,
  );

  useEffect(() => {
    getDailyGoal()
      .then(setDailyGoal)
      .catch((err) => {
        console.error("Failed to load daily goal:", err);
        setDailyGoal(50);
      })
      .finally(() => setGoalLoading(false));
  }, []);

  const loadSessions = useCallback(async (y: number, m: number) => {
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

  const handleAddSession = () => {
    setSelectedDate(undefined);
    setSessionToEdit(null);
    setEditingFromDay(undefined);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session: ReadingSession, dayDate: Date) => {
    setIsDayDetailsOpen(false);
    setSessionToEdit(session);
    setEditingFromDay(dayDate);
    setIsSessionModalOpen(true);
  };

  const handleAddSessionForDay = (date: Date) => {
    setIsDayDetailsOpen(false);
    setSelectedDate(date);
    setSessionToEdit(null);
    setEditingFromDay(date);
    setIsSessionModalOpen(true);
  };

  const handleSessionSaved = () => {
    loadSessions(year, month);
  };

  const handleModalClose = () => {
    setIsSessionModalOpen(false);
    setSessionToEdit(null);
    setSelectedDate(undefined);

    if (editingFromDay) {
      setSelectedDay(editingFromDay);
      setIsDayDetailsOpen(true);
      setEditingFromDay(undefined);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    setIsDayDetailsOpen(true);
  };

  const handleDeleteSession = async (id: string) => {
    const result = await deleteSession(id);
    if (result.success) {
      showSuccess("Сессия удалена");
      loadSessions(year, month);
    } else {
      showError("Ошибка", result.error);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-3xl font-bold">Трекер</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          {loading || goalLoading ? (
            <TrackerSkeleton />
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : (
            <>
              <TrackerHeader
                year={year}
                month={month}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onYearChange={handleYearChange}
              />
              <TrackerStats sessions={sessions} year={year} month={month} />

              <div className="flex justify-end">
                <Button onClick={handleAddSession} className="w-full sm:w-auto">
                  <Plus className="size-4 mr-2" />
                  Добавить сессию
                </Button>
              </div>

              <CalendarGrid
                year={year}
                month={month}
                sessions={sessions}
                dailyGoal={dailyGoal}
                onDayClick={handleDayClick}
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

      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={handleModalClose}
        sessions={sessions}
        initialDate={selectedDate}
        sessionToEdit={sessionToEdit}
        onSuccess={handleSessionSaved}
      />

      <DayDetailsModal
        isOpen={isDayDetailsOpen}
        onClose={() => setIsDayDetailsOpen(false)}
        date={selectedDay!}
        sessions={sessions}
        onEditSession={handleEditSession}
        onAddSession={handleAddSessionForDay}
        onDeleteSession={handleDeleteSession}
        onSuccess={() => loadSessions(year, month)}
      />
    </div>
  );
}
