"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  publisher?: string | null;
}

interface BookSelectProps {
  value: string;
  onChange: (bookId: string, bookTitle: string) => void;
  books: Book[];
  loading?: boolean;
  error?: string;
}

export function BookSelect({
  value,
  onChange,
  books,
  loading,
  error,
}: BookSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Синхронизация inputValue с пропом value при изменении value извне
  useEffect(() => {
    const book = books.find((b) => b.id === value);
    if (book) {
      setInputValue(`${book.title} — ${book.author}`);
    } else if (!value) {
      setInputValue("");
    }
  }, [value, books]);

  const filteredBooks = useMemo(() => {
    if (!inputValue.trim()) return books;
    const query = inputValue.trim().toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query),
    );
  }, [books, inputValue]);

  const handleSelect = (selectedValue: string | null) => {
    if (selectedValue === null) {
      // Очистка
      onChange("", "");
      setInputValue("");
      setOpen(false);
      return;
    }
    const book = books.find((b) => b.id === selectedValue);
    if (book) {
      onChange(book.id, book.title);
      setInputValue(`${book.title} — ${book.author}`);
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    // Если пользователь стирает текст, то сбрасываем выбор
    if (!val.trim()) {
      onChange("", "");
    }
    // При вводе текста не меняем value, только фильтруем
  };

  return (
    <Combobox
      value={value}
      onValueChange={handleSelect}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxInput
        placeholder="Поиск книги..."
        showClear
        disabled={loading}
        className="w-full"
        value={inputValue}
        onChange={handleInputChange}
      />
      <ComboboxContent>
        <ComboboxList>
          {filteredBooks.map((book) => (
            <ComboboxItem key={book.id} value={book.id}>
              <div className="flex items-center gap-3 w-full">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded-md shrink-0"
                  />
                ) : (
                  <div className="w-10 h-14 bg-muted rounded-md shrink-0" />
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">{book.title}</span>
                  <span className="text-sm text-muted-foreground truncate">
                    {book.author}
                  </span>
                  {book.publisher && (
                    <span className="text-xs text-muted-foreground/70 truncate">
                      {book.publisher}
                    </span>
                  )}
                </div>
              </div>
            </ComboboxItem>
          ))}
          {filteredBooks.length === 0 && !loading && (
            <div className="p-2 text-center text-muted-foreground">
              {error || "Нет непрочитанных книг"}
            </div>
          )}
          {loading && (
            <div className="p-2 text-center text-muted-foreground">
              Загрузка книг...
            </div>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
