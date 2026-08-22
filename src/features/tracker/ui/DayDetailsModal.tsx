"use client";

import { useMemo } from "react";
import { AddModal } from "@/components/AddModal";
import type { ReadingSession } from "@/shared/models/ReadingSession";

import { DaySessionListItem } from "./DaySessionListItem";
import { DayStats } from "./DayStats";

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  sessions: ReadingSession[];
  onEditSession: (session: ReadingSession, date: Date) => void;
  onAddSession: (date: Date) => void;
  onDeleteSession: (id: string) => Promise<void>;
  onSuccess: () => void;
}

export function DayDetailsModal({
  isOpen,
  onClose,
  date,
  sessions,
  onEditSession,
  onAddSession,
  onDeleteSession,
  onSuccess,
}: DayDetailsModalProps) {
  if (!date) return null;

  const daySessions = useMemo(() => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return sessions
      .filter((s) => {
        const sDate = new Date(s.startDate);
        return sDate >= startOfDay && sDate <= endOfDay;
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [sessions, date]);

  const handleDelete = async (id: string) => {
    await onDeleteSession(id);
    onSuccess();
  };

  const formattedDate = date.toLocaleDateString("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AddModal
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      submitLabel="+ Добавить сессию"
      onSubmit={(e) => {
        e.preventDefault();
        onAddSession(date);
      }}
      isSubmitting={false}
    >
      <div className="space-y-4">
        <DayStats sessions={daySessions} />

        <div className="space-y-2">
          {daySessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Нет сессий за этот день
            </div>
          ) : (
            daySessions.map((session) => (
              <DaySessionListItem
                key={session._id}
                session={session}
                onEdit={(s) => onEditSession(s, date)}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </AddModal>
  );
}
