"use client";

import { X, Trash2, ChevronDown, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Listbox } from "@headlessui/react";
import type { Book, BookInput } from "@/models/Book";
import { GenreInput } from "./GenreInput";
import { QuoteInput } from "./QuoteInput";

interface BookModalProps {
  isOpen: boolean;
  bookToEdit: Book | null;
  onClose: () => void;
  onSave: (data: BookInput) => Promise<void>; // изменено на Promise<void>
  onDelete?: (book: Book) => void;
}

export function BookModal({
  isOpen,
  bookToEdit,
  onClose,
  onSave,
  onDelete,
}: BookModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Состояния формы (без изменений)
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [series, setSeries] = useState("");
  const [pages, setPages] = useState<number | "">("");
  const [genres, setGenres] = useState<string[]>([]);
  const [format, setFormat] = useState<"бумажная" | "электронная" | "аудио">(
    "бумажная",
  );
  const [status, setStatus] = useState<
    "не прочитано" | "прочитано" | "брошено"
  >("не прочитано");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [quotes, setQuotes] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Состояния ошибок
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // useEffect для заполнения при редактировании (без изменений)
  useEffect(() => {
    if (bookToEdit?._id) {
      setTitle(bookToEdit.title || "");
      setAuthor(bookToEdit.author || "");
      setPublisher(bookToEdit.publisher || "");
      setSeries(bookToEdit.series || "");
      setPages(bookToEdit.pages ?? "");
      setGenres(bookToEdit.genres || []);
      setFormat(bookToEdit.format || "бумажная");
      setStatus(bookToEdit.status || "не прочитано");
      setRating(bookToEdit.rating || 0);
      setReview(bookToEdit.review || "");
      setAnnotation(bookToEdit.annotation || "");
      setQuotes(bookToEdit.quotes || []);
      setDescription(bookToEdit.description || "");
      setCoverPreview(bookToEdit.cover || null);
    } else {
      resetForm();
    }
  }, [bookToEdit]);

  // useEffect для блокировки скролла и Escape (без изменений)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Вспомогательные функции (без изменений)
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPublisher("");
    setSeries("");
    setPages("");
    setGenres([]);
    setFormat("бумажная");
    setStatus("не прочитано");
    setRating(0);
    setReview("");
    setAnnotation("");
    setQuotes([]);
    setDescription("");
    setCoverPreview(null);
    setCoverFile(null);
    setErrors({});
    setGeneralError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setCoverPreview(null);
    setCoverFile(null);
  };

  // ОБНОВЛЕННЫЙ handleSubmit
  const handleSubmit = async () => {
    setErrors({});
    setGeneralError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrors({ title: ["Введите название книги"] });
      const element = document.getElementById("field-title");
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const bookData: BookInput = {
      title: trimmedTitle,
      author: author.trim() || null,
      publisher: publisher.trim() || null,
      series: series.trim() || null,
      pages: pages ? Number(pages) : null,
      genres,
      format,
      status,
      rating: status === "прочитано" ? rating : 0,
      review: review.trim() || null,
      annotation: annotation.trim() || null,
      quotes,
      description: description.trim() || null,
      cover: coverPreview,
      isFavorite: bookToEdit?.isFavorite || false,
    };

    if (bookToEdit?._id) {
      (bookData as any).id = bookToEdit._id;
    }

    try {
      await onSave(bookData);
      handleClose(); // Закрываем только при успехе
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "Не удалось сохранить книгу",
      );
    }
  };

  if (!isOpen) return null;

  const inputBaseClasses =
    "w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-bg-primary w-full max-w-lg rounded-lg max-h-[90vh] flex flex-col shadow-2xl border border-border"
      >
        {/* Header (без изменений) */}
        <div className="flex bg-bg-secondary rounded-t-lg items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-white/70">
            {bookToEdit?._id ? "Редактировать книгу" : "Добавить книгу"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-border/40 transition-colors"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Cover + Title + Author */}
          <div className="flex gap-4">
            {/* Обложка (без изменений) */}
            <div className="relative w-24 h-36 rounded-lg overflow-hidden bg-border/30 shrink-0">
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    alt="Обложка"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                    <Camera className="w-8 h-8 text-text" />
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeCover();
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-2xl hover:bg-border/20 transition-colors rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-text" />
                  <span className="text-xs text-text">Загрузить</span>
                </label>
              )}
            </div>

            {/* Название и Автор */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Название <span className="text-red-400">*</span>
                </label>
                <input
                  id="field-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=". . ."
                  className={`${inputBaseClasses} ${errors.title ? "border-red-400 ring-1 ring-red-400" : ""}`}
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Автор
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder=". . ."
                  className={inputBaseClasses}
                />
              </div>
            </div>
          </div>

          {/* Publisher + Series + Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Издательство
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder=". . ."
                className={inputBaseClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Серия
              </label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder=". . ."
                className={inputBaseClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Страниц
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) =>
                  setPages(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder=". . ."
                min="1"
                className={inputBaseClasses}
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Жанры
            </label>
            <GenreInput genres={genres} onChange={setGenres} />
          </div>

          {/* Format + Status (без изменений, уже используют Listbox) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Формат
              </label>
              <Listbox value={format} onChange={setFormat}>
                <div className="relative">
                  <Listbox.Button className="w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-accent/50 flex justify-between items-center">
                    <span>
                      {format === "бумажная"
                        ? "Бумажная"
                        : format === "электронная"
                          ? "Электронная"
                          : "Аудио"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-lg shadow-lg max-h-60 overflow-auto py-1">
                    <Listbox.Option
                      value="бумажная"
                      className={({ active }) =>
                        `cursor-pointer select-none relative px-3 py-2 ${active ? "bg-accent/10 text-accent" : "text-text"}`
                      }
                    >
                      Бумажная
                    </Listbox.Option>
                    <Listbox.Option
                      value="электронная"
                      className={({ active }) =>
                        `cursor-pointer select-none relative px-3 py-2 ${active ? "bg-accent/10 text-accent" : "text-text"}`
                      }
                    >
                      Электронная
                    </Listbox.Option>
                    <Listbox.Option
                      value="аудио"
                      className={({ active }) =>
                        `cursor-pointer select-none relative px-3 py-2 ${active ? "bg-accent/10 text-accent" : "text-text"}`
                      }
                    >
                      Аудио
                    </Listbox.Option>
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Статус
              </label>
              <Listbox value={status} onChange={setStatus}>
                <div className="relative">
                  <Listbox.Button className="w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-accent/50 flex justify-between items-center">
                    <span>
                      {status === "не прочитано"
                        ? "Не прочитано"
                        : status === "прочитано"
                          ? "Прочитано"
                          : "Брошено"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-lg shadow-lg max-h-60 overflow-auto py-1">
                    <Listbox.Option
                      value="не прочитано"
                      className={({ active }) =>
                        `cursor-pointer select-none relative px-3 py-2 ${active ? "bg-accent/10 text-accent" : "text-text"}`
                      }
                    >
                      Не прочитано
                    </Listbox.Option>
                    <Listbox.Option
                      value="прочитано"
                      className={({ active }) =>
                        `cursor-pointer select-none relative px-3 py-2 ${active ? "bg-accent/10 text-accent" : "text-text"}`
                      }
                    >
                      Прочитано
                    </Listbox.Option>
                    <Listbox.Option
                      value="брошено"
                      className={({ active }) =>
                        `cursor-pointer select-none relative px-3 py-2 ${active ? "bg-accent/10 text-accent" : "text-text"}`
                      }
                    >
                      Брошено
                    </Listbox.Option>
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Rating, Review, Annotation, Quotes, Description (без изменений) */}
          {status === "прочитано" && (
            <>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Оценка
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <span
                        className={
                          n <= rating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Отзыв
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder=". . ."
                  rows={3}
                  className={inputBaseClasses}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Аннотация
            </label>
            <textarea
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder=". . ."
              rows={3}
              className={inputBaseClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Цитаты
            </label>
            <QuoteInput quotes={quotes} onChange={setQuotes} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Заметки
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=". . ."
              rows={2}
              className={inputBaseClasses}
            />
          </div>

          {/* Общая ошибка сервера */}
          {generalError && (
            <div className="text-sm text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {generalError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          {bookToEdit?._id ? (
            <button
              type="button"
              onClick={() => {
                onDelete?.(bookToEdit);
                handleClose();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Удалить</span>
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-border text-text hover:bg-border/40 transition-colors text-sm"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-accent text-bg-primary hover:bg-accent/80 transition-colors text-sm font-medium"
            >
              {bookToEdit?._id ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
