"use client";

import { LibraryBook, STATUS_LABELS } from "@/shared/models/Book";
import { FORMAT_OPTIONS } from "@/features/library/config/filterOptions";
import { cn } from "@/shared/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Heart, FileText, Camera } from "lucide-react";

interface BookCardProps {
  book: LibraryBook;
  onToggleLike?: (bookId: string) => void;
  onDelete?: (bookId: string) => void;
}

export function BookCard({ book, onToggleLike, onDelete }: BookCardProps) {
  const formatOption = FORMAT_OPTIONS.find((opt) => opt.value === book.format);
  const FormatIcon = formatOption?.icon || FileText;

  return (
    <Card className="group/card gap-2">
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

        <CardAction>
          <Button
            variant="ghost"
            onClick={() => {}}
            className={cn(
              "p-1.5 transition-colors dark:hover:bg-card",
              book.isFavorite
                ? "text-destructive hover:text-muted-foreground"
                : "text-muted-foreground/50 hover:text-destructive",
            )}
          >
            <Heart
              className={cn("size-4", book.isFavorite && "fill-current")}
            />
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
