"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AddBookInput,
  AddBookSchema,
} from "@/features/library/model/validation";
import { AddModal } from "@/components/AddModal";
import {
  addBookAction,
  updateBookAction,
} from "@/features/library/api/actions";
import { uploadCoverAction } from "@/features/library/api/uploadCoverAction";
import {
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
} from "@/features/library/config/filterOptions";
import type { LibraryBook } from "@/shared/models/Book";
import { compressImage } from '@/shared/lib/compressImage';
import { showSuccess, showError } from "@/shared/lib/toast";

import { FieldInput } from "@/components/FieldInput";
import { FieldTags } from "@/components/FieldTags";
import { FieldImageUpload } from "@/components/FieldImage";
import { FieldSelect } from "@/components/FieldSelect";
import { RatingStars } from "@/components/RatingStars";
import { QuoteInput } from "@/components/QuoteInput";
import { QuoteList } from "@/components/QuoteList";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  editBook?: LibraryBook | null;
}

type Quote = { id: string; text: string; page?: number };

export function AddBookModal({ isOpen, onClose, editBook }: AddBookModalProps) {
  const isEditMode = !!editBook;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddBookInput>({
    resolver: zodResolver(AddBookSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      series: "",
      isbn: "",
      annotation: "",
      pages: undefined,
      cover: "",
      tags: [],
      readingStatus: "не прочитано",
      format: "бумажная",
      rating: undefined,
      review: "",
      quotes: [],
    },
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [quotePage, setQuotePage] = useState<number | undefined>(undefined);

  const currentStatus = watch("readingStatus");
  const currentRating = watch("rating");

  useEffect(() => {
    if (isEditMode && editBook && isOpen) {
      setSelectedTags(editBook.tags);
      setCoverPreview(editBook.cover ?? null);
      setCoverFile(null);
      setQuotes(
        editBook.quotes.map((q) => ({
          id: q._id ?? Date.now().toString(),
          text: q.text,
          page: q.page,
        })),
      );
      setQuoteText("");
      setQuotePage(undefined);
      setEditingId(null);

      reset({
        title: editBook.title,
        author: editBook.author,
        publisher: editBook.publisher ?? "",
        series: editBook.series ?? "",
        isbn: editBook.isbn ?? "",
        annotation: editBook.annotation ?? "",
        pages: editBook.pages,
        cover: editBook.cover ?? "",
        tags: editBook.tags,
        readingStatus: editBook.readingStatus,
        format: editBook.format,
        rating: editBook.rating,
        review: editBook.review ?? "",
        quotes: [],
      });
    } else if (!isEditMode && isOpen) {
      reset({
        title: "",
        author: "",
        publisher: "",
        series: "",
        isbn: "",
        annotation: "",
        pages: undefined,
        cover: "",
        tags: [],
        readingStatus: "не прочитано",
        format: "бумажная",
        rating: undefined,
        review: "",
        quotes: [],
      });
      setSelectedTags([]);
      setCoverPreview(null);
      setCoverFile(null);
      setQuotes([]);
    }
  }, [isEditMode, editBook, isOpen, reset]);

  const handleSaveQuote = () => {
    const trimmed = quoteText.trim();
    if (!trimmed) return;

    if (editingId) {
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === editingId ? { ...q, text: trimmed, page: quotePage } : q,
        ),
      );
      setEditingId(null);
    } else {
      const newQuote: Quote = {
        id: Date.now() + "-" + Math.random().toString(36).substring(2, 9),
        text: trimmed,
        page: quotePage,
      };
      setQuotes((prev) => [...prev, newQuote]);
    }
    setQuoteText("");
    setQuotePage(undefined);
  };

  const handleEditQuote = (id: string) => {
    const quote = quotes.find((q) => q.id === id);
    if (quote) {
      setEditingId(id);
      setQuoteText(quote.text);
      setQuotePage(quote.page);
    }
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setQuoteText("");
      setQuotePage(undefined);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setQuoteText("");
    setQuotePage(undefined);
  };

  const onSubmit = async (data: AddBookInput) => {
    let coverUrl = data.cover;

    if (coverFile) {
      let fileToUpload = coverFile;
      try {
        const compressed = await compressImage(coverFile, 100 * 1024);
        if (compressed) {
          fileToUpload = compressed;
          const previewUrl = URL.createObjectURL(compressed);
          setCoverPreview(previewUrl);
        } else {
          console.warn("Не удалось сжать изображение, используется оригинал");
        }
      } catch (error) {
        console.warn("Ошибка сжатия, используется оригинал", error);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      try {
        const result = await uploadCoverAction(formData);
        coverUrl = result.url;
      } catch (error) {
        showError("Ошибка загрузки обложки", (error as Error).message);
        return;
      }
    }

    const result =
      isEditMode && editBook
        ? await updateBookAction(editBook._id, {
            ...data,
            tags: selectedTags,
            cover: coverUrl || undefined,
            quotes: quotes.map(({ id, ...rest }) => rest),
          })
        : await addBookAction({
            ...data,
            tags: selectedTags,
            cover: coverUrl || undefined,
            quotes: quotes.map(({ id, ...rest }) => rest),
          });

    if (result.success) {
      showSuccess(
        isEditMode ? "Книга обновлена" : "Книга добавлена в библиотеку",
      );
      reset();
      setSelectedTags([]);
      setCoverPreview(null);
      setCoverFile(null);
      setQuotes([]);
      setQuoteText("");
      setQuotePage(undefined);
      setEditingId(null);
      onClose();
    } else {
      showError("Ошибка", result.error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(onSubmit)(e);
  };

  return (
    <AddModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Редактировать книгу" : "Добавить книгу"}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="flex gap-4">
        <div className="row-span-3">
          <FieldImageUpload
            value={coverPreview}
            onChange={(file, preview) => {
              setCoverFile(file);
              setCoverPreview(preview);
            }}
          />
        </div>

        <div className="space-y-3 flex-1">
          <FieldInput
            label="НАЗВАНИЕ *"
            register={register("title")}
            error={errors.title}
            placeholder="Введите название"
          />
          <FieldInput
            label="АВТОР *"
            register={register("author")}
            error={errors.author}
            placeholder="Введите имя автора"
          />

          <FieldInput
            label="КОЛИЧЕСТВО СТРАНИЦ"
            register={register("pages", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            type="number"
            placeholder="123"
            min={1}
          />
        </div>
      </div>

      <Separator />

      <FieldTags label="ТЕГИ" value={selectedTags} onChange={setSelectedTags} />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldInput
            label="ИЗДАТЕЛЬСТВО"
            register={register("publisher")}
            placeholder="Издательство"
          />
        </div>
        <div>
          <FieldInput
            label="СЕРИЯ"
            register={register("series")}
            placeholder="Название серии"
          />
        </div>
      </div>

      <FieldInput
        label="ISBN"
        register={register("isbn")}
        placeholder="Номер isbn"
      />

      <Separator />

      <div className="space-y-2">
        <FieldSelect
          control={control}
          name="format"
          label="ФОРМАТ"
          options={FORMAT_OPTIONS}
        />
        <FieldSelect
          control={control}
          name="readingStatus"
          label="СТАТУС ЧТЕНИЯ"
          options={STATUS_OPTIONS}
        />
      </div>

      {(currentStatus === "прочитано" || currentStatus === "брошено") && (
        <>
          <Separator />
          <div className="flex">
            <FieldInput
              label="ОЦЕНКА"
              register={register("rating", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              type="number"
              min={1}
              max={10}
              placeholder="1–10"
              error={errors.rating}
              className="w-40"
            />
            {currentRating !== undefined && currentRating > 0 && (
              <div className="pt-6">
                <RatingStars rating={currentRating} />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              ОТЗЫВ
            </label>
            <Textarea
              {...register("review")}
              placeholder="Ваш отзыв"
              rows={2}
              className="mt-1"
            />
          </div>
        </>
      )}

      <Separator />

      <div>
        <label className="text-xs font-medium text-muted-foreground">
          ЦИТАТЫ
        </label>
        <QuoteInput
          value={quoteText}
          onChange={setQuoteText}
          page={quotePage}
          onPageChange={setQuotePage}
          onSave={handleSaveQuote}
          onCancel={handleCancelEdit}
          isEditing={!!editingId}
          disabled={!quoteText.trim()}
        />
        <QuoteList
          quotes={quotes}
          onEdit={handleEditQuote}
          onDelete={handleDeleteQuote}
        />
      </div>

      <Separator />

      <div>
        <label className="text-xs font-medium text-muted-foreground">
          АННОТАЦИЯ
        </label>
        <Textarea
          {...register("annotation")}
          placeholder="Краткое описание"
          rows={3}
          className="mt-1"
        />
      </div>
    </AddModal>
  );
}
