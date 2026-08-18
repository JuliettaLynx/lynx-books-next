import { useState, useCallback, useMemo } from "react";
import {
  BookFormat,
  BookReadingStatus,
  type LibraryBook,
} from "@/shared/models/Book";

export interface LibraryFilters {
  search: string;
  readingStatus: BookReadingStatus | null;
  format: BookFormat | null;
  seriesName: string | null;
  author: string | null;
  publisher: string | null;
  tags: string[];
  tagLogic: "OR" | "AND";
  isFavorite: boolean | null;
}

export const defaultFilters: LibraryFilters = {
  search: "",
  readingStatus: null,
  format: null,
  seriesName: null,
  author: null,
  publisher: null,
  tags: [],
  tagLogic: "OR",
  isFavorite: null,
};

export function useLibraryFilters(books: LibraryBook[]) {
  const [filters, setFilters] = useState<LibraryFilters>(defaultFilters);

  const updateFilter = useCallback(
    <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const activeFilterCount = useMemo(
    () =>
      [
        filters.search !== "",
        filters.readingStatus !== null,
        filters.format !== null,
        filters.seriesName !== null,
        filters.author !== null,
        filters.publisher !== null,
        filters.tags.length > 0,
        filters.isFavorite !== null,
      ].filter(Boolean).length,
    [filters],
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          (book.isbn && book.isbn.includes(search));
        if (!matchesSearch) return false;
      }

      if (
        filters.readingStatus &&
        book.readingStatus !== filters.readingStatus
      ) {
        return false;
      }
      if (filters.format && book.format !== filters.format) {
        return false;
      }

      if (filters.seriesName && book.seriesName !== filters.seriesName)
        return false;
      if (filters.author && book.author !== filters.author) return false;
      if (filters.publisher && book.publisher !== filters.publisher)
        return false;

      if (filters.tags.length > 0 && filters.tagLogic === "OR") {
        const hasAnyTag = filters.tags.some((tag) => book.tags.includes(tag));
        if (!hasAnyTag) return false;
      }

      if (filters.tags.length > 0 && filters.tagLogic === "AND") {
        const hasAllTags = filters.tags.every((tag) => book.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      if (filters.isFavorite !== null) {
        if (filters.isFavorite !== book.isFavorite) return false;
      }

      return true;
    });
  }, [books, filters]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    books.forEach((book) => book.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [books]);

  const allSeries = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      if (book.seriesName) set.add(book.seriesName);
    });
    return Array.from(set).sort();
  }, [books]);

  const allAuthors = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => set.add(book.author));
    return Array.from(set).sort();
  }, [books]);

  const allPublishers = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      if (book.publisher) set.add(book.publisher);
    });
    return Array.from(set).sort();
  }, [books]);

  return {
    filters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    filteredBooks,
    allTags,
    allSeries,
    allAuthors,
    allPublishers,
  };
}
