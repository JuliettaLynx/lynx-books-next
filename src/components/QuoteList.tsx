"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type Quote = { id: string; text: string; page?: number };

interface QuoteListProps {
  quotes: Quote[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuoteList({ quotes, onEdit, onDelete }: QuoteListProps) {
  if (quotes.length === 0) return null;

  return (
    <div className="mt-5 space-y-2">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="flex items-start gap-2 p-2 border rounded-md bg-muted/30"
        >
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap">{quote.text}</p>
            {quote.page && (
              <p className="text-xs text-muted-foreground">Стр. {quote.page}</p>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(quote.id)}
              className="cursor-pointer dark:hover:bg-muted/0"
            >
              <Edit className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(quote.id)}
              className="cursor-pointer dark:hover:bg-muted/0"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
