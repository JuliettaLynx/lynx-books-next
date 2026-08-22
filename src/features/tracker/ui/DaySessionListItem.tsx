"use client";

import { ReadingSession } from "@/shared/models/ReadingSession";
import { SESSION_COLORS } from "@/shared/constants/colors";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DaySessionListItemProps {
  session: ReadingSession;
  onEdit: (session: ReadingSession) => void;
  onDelete: (id: string) => void;
}

export function DaySessionListItem({
  session,
  onEdit,
  onDelete,
}: DaySessionListItemProps) {
  // пока нет работы с цветами
  // const color = SESSION_COLORS[session.colorIndex] || "var(--primary)";
  const color = "var(--primary)";

  const duration = session.durationMinutes || 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationStr =
    duration > 0 ? (hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`) : null;

  const startTime = format(session.startDate, "HH:mm");
  const endTime = format(session.endDate, "HH:mm");
  const startPage = session.startPage || 1;
  const endPage = session.endPage || 1;
  const pagesRead = session.pagesRead || 0;

  return (
    <div
      className="flex items-stretch gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onEdit(session)}
    >
      <div
        className="w-1 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium truncate">{session.bookTitle}</div>
          {session.finishedBook && (
            <Badge className="text-xs shrink-0">Дочитана</Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
          {durationStr ? (
            <>
              <span>
                {startTime} → {endTime}
              </span>
              <span>•</span>
              <span>{durationStr}</span>
            </>
          ) : (
            <span>Время не указано</span>
          )}
        </div>

        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
          <span>
            {startPage} → {endPage}
          </span>
          <span>•</span>
          <span>{pagesRead} страниц</span>
        </div>

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {session.notes && (
          <div className="text-sm text-muted-foreground/80 mt-1 line-clamp-2">
            {session.notes}
          </div>
        )}
      </div>

      <ConfirmModal
        trigger={
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        }
        title="Удалить сессию?"
        description="Вы уверены, что хотите удалить эту сессию? Это действие нельзя отменить."
        confirmText="Удалить"
        variant="destructive"
        onConfirm={() => onDelete(session._id)}
      />
    </div>
  );
}
