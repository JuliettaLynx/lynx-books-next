"use client";

import { BookCard } from "@/features/library/ui/BookCard";
import { FilterBar } from "@/features/library/ui/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { useLibraryFilters } from "@/features/library/hooks/useLibraryFilters";
import { mockBooks } from "@/features/library/model/mocks.client";
import type { LibraryBook } from "@/shared/models/Book";
import { useState } from "react";

import { LibraryBig, BookDashed } from "lucide-react";

export default function LibraryPage() {
  const {
    filters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    filteredBooks,
    allTags,
  } = useLibraryFilters(mockBooks as LibraryBook[]);

  const [tagLogic, setTagLogic] = useState<"OR" | "AND">("OR");

  const handleTagLogicChange = (value: "OR" | "AND") => {
    setTagLogic(value);
    updateFilter("tagLogic", value);
  };

  function getBookEnding(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) return "книга";
    if (
      lastDigit >= 2 &&
      lastDigit <= 4 &&
      (lastTwoDigits < 10 || lastTwoDigits >= 20)
    )
      return "книги";
    return "книг";
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="pt-1 tracking-wider text-2xl font-bold text-foreground">
        Моя библиотека
      </h1>
      <FilterBar
        search={filters.search}
        onSearchChange={(v) => updateFilter("search", v)}
        status={filters.status}
        onStatusChange={(v) => updateFilter("status", v)}
        format={filters.format}
        onFormatChange={(v) => updateFilter("format", v)}
        tags={filters.tags}
        onTagsChange={(v) => updateFilter("tags", v)}
        tagLogic={tagLogic}
        onTagLogicChange={handleTagLogicChange}
        isFavorite={filters.isFavorite}
        onFavoriteChange={(v) => updateFilter("isFavorite", v)}
        allTags={allTags}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />
      {filteredBooks.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {filteredBooks.length === 1 ? "Показана " : "Показано "}
          {filteredBooks.length} {getBookEnding(filteredBooks.length)}
        </p>
      )}

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={String(book._id)}
              book={book}
              onToggleLike={(id) => {
                console.log("Toggle favorite:", id);
              }}
            />
          ))}
        </div>
      ) : mockBooks.length > 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте изменить параметры фильтрации"
          buttonText="Сбросить все фильтры"
          onButtonClick={resetFilters}
          icon={<LibraryBig />}
        />
      ) : (
        <EmptyState
          title="Добавьте свою первую книгу"
          description="Начните заполнять библиотеку"
          buttonText="+ Добавить книгу"
          onButtonClick={() => {}}
          icon={<BookDashed />}
        />
      )}
    </div>
  );
}
