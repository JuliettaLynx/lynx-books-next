"use client";

import Image from "next/image";
import { LibraryBook, STATUS_LABELS } from "@/shared/models/Book";
import { cn } from "@/shared/lib/utils";
import { FORMAT_OPTIONS } from "@/features/library/config/filterOptions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Heart, FileText, Camera, Trash2 } from "lucide-react";

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
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center bg-background/40 -bg-linear-20 from-background/50 from-30% via-chart-3/5 via-70% to-primary/10">
              <Camera className="size-10 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Нет обложки</span>
            </div>
          )}

          <div className="absolute left-2 top-2">
            <span className="h-7 inline-flex items-center gap-1 rounded-lg bg-background/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <FormatIcon className="size-3 stroke-[2.5]" />
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
                "size-9 rounded-lg bg-background/80 dark:hover:bg-background/80 cursor-pointer",
                book.isFavorite
                  ? "text-destructive hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-destructive",
              )}
            >
              <Heart
                className={cn(
                  "size-5 stroke-[2.5]",
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
                      className="size-9 rounded-lg bg-background/80 dark:hover:bg-background/80 text-muted-foreground hover:text-destructive"
                      type="button"
                    >
                      <Trash2 className="size-5 stroke-[2.5]" />
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
          {book.seriesName && (
            <p className="text-xs text-muted-foreground truncate -mt-1.5">
              {book.seriesName}
              {book.seriesNumber ? ` #${book.seriesNumber}` : ""}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{book.author}</p>
        </CardHeader>

        <CardContent className="gap-2 px-3">
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
