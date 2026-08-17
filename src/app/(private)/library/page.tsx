"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/features/library/ui/BookCard";
import { FilterBar } from "@/features/library/ui/FilterBar";
import { AddBookModal } from "@/features/library/ui/AddBookModal";
import { EmptyState } from "@/components/EmptyState";
import { useLibraryFilters } from "@/features/library/hooks/useLibraryFilters";
import { getBooks } from "@/features/library/api/actions";
import type { LibraryBook } from "@/shared/models/Book";

import { LibraryBig, BookDashed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Failed to load books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const {
    filters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    filteredBooks,
    allTags,
  } = useLibraryFilters(books);

  const [tagLogic, setTagLogic] = useState<"OR" | "AND">("OR");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-40">
        <div className="text-muted-foreground">Загрузка библиотеки...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="pt-1 tracking-wider text-2xl font-bold text-foreground">
        Моя библиотека
      </h1>

      <FilterBar
        search={filters.search}
        onSearchChange={(v) => updateFilter("search", v)}
        readingStatus={filters.readingStatus}
        onReadingStatusChange={(v) => updateFilter("readingStatus", v)}
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

      <div className="flex flex-col gap-2 md:flex-row-reverse">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto md:ml-auto"
        >
          <Plus className="size-4 mr-2" />
          Добавить книгу
        </Button>

        {filteredBooks.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {filteredBooks.length === 1 ? "Показана " : "Показано "}
            {filteredBooks.length} {getBookEnding(filteredBooks.length)}
          </p>
        )}
      </div>

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
      ) : books.length > 0 ? (
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
          onButtonClick={() => setIsModalOpen(true)}
          icon={<BookDashed />}
        />
      )}

      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadBooks();
        }}
      />
    </div>
  );
}
