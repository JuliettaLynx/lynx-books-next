"use client";

import { useState, useEffect, useCallback } from "react";
import type { Book, BookInput } from "@/models/Book";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (input: BookInput) => {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка создания");
      }
      const newBook = await res.json();
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания");
      throw err;
    }
  };

  const updateBook = async (id: string, input: Partial<BookInput>) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка обновления");
      }
      const updated = await res.json();
      setBooks((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...updated } : b)),
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления");
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка удаления");
      }
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления");
      throw err;
    }
  };

  const toggleFavorite = async (book: Book) => {
    const newFavorite = !book.isFavorite;
    try {
      const res = await fetch(`/api/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newFavorite }),
      });
      if (!res.ok) throw new Error("Ошибка обновления");
      setBooks((prev) =>
        prev.map((b) =>
          b._id === book._id ? { ...b, isFavorite: newFavorite } : b,
        ),
      );
      return newFavorite;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления");
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleFavorite,
    refresh: fetchBooks,
  };
}
