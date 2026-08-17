"use client";

import { LibraryBook, STATUS_LABELS } from "@/shared/models/Book";
import { FORMAT_OPTIONS } from "@/features/library/config/filterOptions";
import { cn } from "@/shared/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, FileText, Camera, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

interface BookCardProps {
  book: LibraryBook;
  onToggleLike?: (bookId: string) => void;
  onDelete?: (bookId: string) => void;
  onEdit?: (bookId: string) => void;
}

export function BookCard({
  book,
  onToggleLike,
  onDelete,
  onEdit,
}: BookCardProps) {
  const formatOption = FORMAT_OPTIONS.find((opt) => opt.value === book.format);
  const FormatIcon = formatOption?.icon || FileText;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, [role="button"]')) {
      return;
    }
    onEdit?.(book._id);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="group/card gap-2 h-full">
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-t-xl bg-muted/30">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="size-full object-cover transition-opacity group-hover/card:opacity-90"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center bg-background/40 -bg-linear-20 from-background/50 from-30% via-chart-3/5 via-70% to-primary/10">
              <Camera className="size-10 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Нет обложки</span>
            </div>
          )}

          <div className="absolute left-2 top-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/40 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground backdrop-blur-sm">
              <FormatIcon className="size-3" />
              {STATUS_LABELS[book.readingStatus]}
            </span>
          </div>

          <div className="absolute right-2 bottom-2 flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike?.(book._id);
              }}
              className={cn(
                "size-9 rounded-lg bg-background/70 backdrop-blur-sm transition-colors dark:hover:bg-background/70 cursor-pointer",
                book.isFavorite
                  ? "text-destructive hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-destructive",
              )}
            >
              <Heart
                className={cn(
                  "size-5 stroke-3",
                  book.isFavorite && "fill-current",
                )}
              />
            </Button>

            {onDelete && (
              <div onClick={(e) => e.stopPropagation()}>
                <ConfirmModal
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-lg bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-destructive dark:hover:bg-background/0 cursor-pointer"
                      type="button"
                    >
                      <Trash2 className="size-5 stroke-3" />
                    </Button>
                  }
                  title="Удалить книгу?"
                  description={`Книга «${book.title}» будет удалена из библиотеки. Это действие нельзя отменить.`}
                  confirmText="Удалить"
                  variant="destructive"
                  onConfirm={() => onDelete?.(book._id)}
                />
              </div>
            )}
          </div>
        </div>

        <CardHeader className="gap-1 px-3">
          <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
            {book.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{book.author}</p>
        </CardHeader>

        <CardContent className="gap-2 px-3 pb-3">
          <div className="flex flex-wrap gap-1">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
