"use client";

import {
  Camera,
  Star,
  Heart,
  BookText,
  Tablet,
  Headphones,
  Clock,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Book, BookFormat, BookStatus } from "@/models/Book";

interface BookCardProps {
  book: Book;
  onFavorite?: (book: Book) => void;
  onClick?: (book: Book) => void;
}

const formatIcons: Record<BookFormat, React.ReactNode> = {
  бумажная: <BookText className="w-5 h-5" />,
  электронная: <Tablet className="w-5 h-5" />,
  аудио: <Headphones className="w-5 h-5" />,
};

const statusIcons: Record<BookStatus, React.ReactNode> = {
  прочитано: <Check className="w-5 h-5 " />,
  "не прочитано": <Clock className="w-5 h-5 " />,
  брошено: <X className="w-5 h-5 " />,
};

export function BookCard({ book, onFavorite, onClick }: BookCardProps) {
  return (
    <div
      className="h-full border border-border dark:border-border-dark bg-bg-secondary dark:bg-bg-secondary-dark rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
      onClick={() => onClick?.(book)}
    >
      {/* Cover */}
      <div className="relative w-full aspect-2/3 bg-field overflow-hidden">
        {book.cover ? (
          <Image
            src={
              book.cover.startsWith("data:")
                ? book.cover
                : `/api/images/${book.cover}`
            }
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <Camera className="w-16 h-16 text-text" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

        {/* Top-right buttons — теперь всегда видны */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(book);
            }}
            className="p-2 rounded-lg bg-bg-primary/60 shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                book.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Format and status */}
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <span className="p-2 rounded-md bg-bg-primary/60 text-white/70 backdrop-blur-sm text-xs flex items-center justify-center">
            {formatIcons[book.format]}
          </span>
          <span className="p-2 rounded-md bg-bg-primary/60 text-white/70 backdrop-blur-sm text-xs flex items-center justify-center">
            {statusIcons[book.status]}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold text-white/70 line-clamp-2 leading-snug">
          {book.title}
        </h3>

        {book.author && (
          <p className="text-xs text-text line-clamp-1">{book.author}</p>
        )}

        {/* Genres */}
        {book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {book.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-border/40 text-gray-500 dark:text-gray-400"
              >
                {genre}
              </span>
            ))}
            {book.genres.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{book.genres.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {book.status === "прочитано" && book.rating > 0 && (
          <div className="flex items-center gap-0.5 pt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < book.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
