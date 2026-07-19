"use client";

import { useState, useMemo } from "react";
import { Plus, Loader2, AlertCircle, BookOpen, Search } from "lucide-react";
import { useBooks } from "@/lib/useBooks";
import { BookCard } from "./BookCard";
import { BookModal } from "./BookModal";
import { SearchInput } from "./SearchInput";
import { FilterBar } from "./FilterBar";
import type { Book, BookStatus, BookInput } from "@/models/Book";

type StatusFilter = "все" | BookStatus;
type FavoriteFilter = "все" | "избранное" | "не избранное";

export default function LibraryPage() {
  const {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleFavorite,
  } = useBooks();

  // Фильтры
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("все");
  const [favoriteFilter, setFavoriteFilter] = useState<FavoriteFilter>("все");
  const [searchQuery, setSearchQuery] = useState("");

  // Модалка
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Фильтрация
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Статус
    if (statusFilter !== "все") {
      result = result.filter((book) => book.status === statusFilter);
    }

    // Избранное
    if (favoriteFilter === "избранное") {
      result = result.filter((book) => book.isFavorite);
    } else if (favoriteFilter === "не избранное") {
      result = result.filter((book) => !book.isFavorite);
    }

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          (book.author?.toLowerCase() ?? "").includes(query),
      );
    }

    return result;
  }, [books, statusFilter, favoriteFilter, searchQuery]);

  // Обработчики
  const handleSave = async (data: BookInput) => {
    if (editingBook?._id) {
      await updateBook(editingBook._id, data);
    } else {
      await addBook(data);
    }
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (book: Book) => {
    if (deleteConfirm === book._id) {
      await deleteBook(book._id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(book._id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SearchInput
            placeholder="Название или автор"
            onChange={setSearchQuery}
          />
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded-lg font-medium hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Добавить книгу</span>
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          favoriteFilter={favoriteFilter}
          onFavoriteFilter={setFavoriteFilter}
        />
      </div>

      {/* Books grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-accent text-bg-primary text-sm hover:bg-accent/80 transition-colors"
          >
            Обновить
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {books.length === 0 ? "Библиотека пуста" : "Книги не найдены"}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {books.length === 0
              ? "Добавьте первую книгу"
              : "Попробуйте изменить параметры поиска или фильтры"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book) => (
            <div key={book._id} className="relative">
              <BookCard
                book={book}
                onFavorite={() => toggleFavorite(book)}
                onClick={handleOpenEdit}
              />
              {/* Delete confirmation overlay */}
              {deleteConfirm === book._id && (
                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConfirm(book);
                    }}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Удалить?
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      <BookModal
        isOpen={isModalOpen}
        bookToEdit={editingBook}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
