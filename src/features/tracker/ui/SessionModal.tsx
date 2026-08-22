"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createReadingSessionSchema,
  type CreateReadingSessionInput,
} from "@/features/tracker/model/validation";
import {
  createSession,
  updateSession,
  getUnreadBooks,
} from "@/features/tracker/api/actions";
import type { ReadingSession } from "@/shared/models/ReadingSession";
import { showSuccess, showError } from "@/shared/lib/toast";
import { HINTS } from "@/shared/constants/hints";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { AddModal } from "@/components/AddModal";
import { FieldTags } from "@/components/FieldTags";
import { FieldInput } from "@/components/FieldInput";
import { DateTimeField } from "@/components/DateTimeField";
import { BookSelect } from "@/components/BookSelect";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ReadingSession[];
  initialDate?: Date;
  sessionToEdit?: ReadingSession | null;
  onSuccess: () => void;
}

export function SessionModal({
  isOpen,
  onClose,
  sessions,
  initialDate,
  sessionToEdit,
  onSuccess,
}: SessionModalProps) {
  const isEditMode = !!sessionToEdit;
  const [books, setBooks] = useState<
    Array<{
      id: string;
      title: string;
      author: string;
      cover?: string | null;
      publisher?: string | null;
    }>
  >([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [noTime, setNoTime] = useState(false);

  const startDateFocused = useRef(false);
  const endDateFocused = useRef(false);

  const methods = useForm<CreateReadingSessionInput>({
    resolver: zodResolver(createReadingSessionSchema),
    defaultValues: {
      bookId: "",
      bookTitle: "",
      colorIndex: 0,
      startDate: new Date(),
      endDate: new Date(),
      startPage: 1,
      endPage: 1,
      finishedBook: false,
      tags: [],
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const bookId = watch("bookId");
  const startPage = watch("startPage");
  const endPage = watch("endPage");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (isOpen) {
      setBooksLoading(true);
      getUnreadBooks()
        .then((data) => setBooks(data))
        .catch(() => showError("Не удалось загрузить книги"))
        .finally(() => setBooksLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && sessionToEdit) {
      const start = new Date(sessionToEdit.startDate);
      start.setSeconds(0, 0);
      const end = new Date(sessionToEdit.endDate);
      end.setSeconds(0, 0);
      reset({
        bookId: sessionToEdit.bookId,
        bookTitle: sessionToEdit.bookTitle,
        colorIndex: sessionToEdit.colorIndex,
        startDate: start,
        endDate: end,
        startPage: sessionToEdit.startPage ?? 1,
        endPage: sessionToEdit.endPage ?? 1,
        finishedBook: sessionToEdit.finishedBook,
        tags: sessionToEdit.tags || [],
        notes: sessionToEdit.notes || "",
      });
      const hasTime = start.getHours() !== 0 || start.getMinutes() !== 0;
      setNoTime(!hasTime);
    } else {
      const now = new Date();
      now.setSeconds(0, 0);
      const start = initialDate ? new Date(initialDate) : now;
      if (initialDate) {
        start.setHours(now.getHours(), now.getMinutes(), 0);
      }
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      reset({
        bookId: "",
        bookTitle: "",
        colorIndex: 0,
        startDate: start,
        endDate: end,
        startPage: 1,
        endPage: 1,
        finishedBook: false,
        tags: [],
        notes: "",
      });
      setNoTime(false);
    }
  }, [isOpen, sessionToEdit, initialDate, reset, isEditMode]);

  const adjustEndDate = useCallback(() => {
    if (isEditMode || noTime) return;
    const currentStartDate = watch("startDate");
    const currentEndDate = watch("endDate");
    if (
      currentStartDate &&
      currentEndDate &&
      currentEndDate.getTime() <= currentStartDate.getTime()
    ) {
      const newEnd = new Date(currentStartDate);
      newEnd.setMinutes(currentStartDate.getMinutes() + 30);
      newEnd.setSeconds(0, 0);
      setValue("endDate", newEnd);
    }
  }, [watch, setValue, noTime, isEditMode]);

  useEffect(() => {
    if (isEditMode || noTime) return;
    if (!startDateFocused.current) {
      adjustEndDate();
    }
  }, [startDate, adjustEndDate, isEditMode, noTime]);

  useEffect(() => {
    if (!bookId || isEditMode) return;
    const bookSessions = sessions
      .filter((s) => s.bookId === bookId)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    let newStartPage = 1;
    if (bookSessions.length > 0) {
      const last = bookSessions[0];
      if (last.endPage != null) {
        newStartPage = last.endPage + 1;
      }
    }
    setValue("startPage", newStartPage);
  }, [bookId, sessions, setValue, isEditMode]);

  const handleStartDateFocus = () => {
    startDateFocused.current = true;
  };
  const handleStartDateBlur = () => {
    startDateFocused.current = false;
    adjustEndDate();
  };
  const handleEndDateFocus = () => {
    endDateFocused.current = true;
  };
  const handleEndDateBlur = () => {
    endDateFocused.current = false;
  };

  const onSubmit: SubmitHandler<CreateReadingSessionInput> = async (data) => {
    let start = new Date(data.startDate);
    let end = new Date(data.endDate);
    if (noTime) {
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
    }
    start.setSeconds(0, 0);
    end.setSeconds(0, 0);

    const payload = {
      ...data,
      startDate: start,
      endDate: end,
      notes: data.notes || undefined,
    };

    const result = isEditMode
      ? await updateSession(sessionToEdit!._id, payload)
      : await createSession(payload);

    if (result.success) {
      showSuccess(isEditMode ? "Сессия обновлена" : "Сессия создана");
      onSuccess();
      onClose();
    } else {
      showError("Ошибка", result.error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(onSubmit)(e);
  };

  const handleBookSelect = (bookId: string, bookTitle: string) => {
    setValue("bookId", bookId);
    setValue("bookTitle", bookTitle);
  };

  const pagesRead =
    startPage && endPage && !isNaN(startPage) && !isNaN(endPage)
      ? endPage - startPage + 1
      : 0;

  return (
    <AddModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Редактировать сессию" : "Добавить сессию"}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
    >
      <FormProvider {...methods}>
        <div className="space-y-4">
          <BookSelect
            value={watch("bookId")}
            onChange={handleBookSelect}
            books={books}
            loading={booksLoading}
          />
          {errors.bookId && (
            <p className="text-xs text-red-500">{errors.bookId.message}</p>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <DateTimeField
              name="startDate"
              label="Начало"
              noTime={noTime}
              onFocus={handleStartDateFocus}
              onBlur={handleStartDateBlur}
              onDateSelect={adjustEndDate}
            />
            <DateTimeField
              name="endDate"
              label="Окончание"
              noTime={noTime}
              onFocus={handleEndDateFocus}
              onBlur={handleEndDateBlur}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="noTime"
              checked={noTime}
              onCheckedChange={(checked) => setNoTime(!!checked)}
            />
            <label
              htmlFor="noTime"
              className="text-sm text-secondary-foreground font-medium"
            >
              Без времени
            </label>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <FieldInput
              label="НАЧАЛЬНАЯ СТРАНИЦА *"
              register={register("startPage", { valueAsNumber: true })}
              type="number"
              min={1}
              error={errors.startPage}
              placeholder="1"
            />
            <FieldInput
              label="КОНЕЧНАЯ СТРАНИЦА *"
              register={register("endPage", { valueAsNumber: true })}
              type="number"
              min={1}
              error={errors.endPage}
              placeholder="1"
            />
          </div>

          {!isNaN(startPage) && !isNaN(endPage) && startPage <= endPage && (
            <div className="text-sm text-muted-foreground">
              Прочитано страниц: <strong>{pagesRead}</strong>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2">
            <Checkbox
              id="finishedBook"
              checked={watch("finishedBook")}
              onCheckedChange={(checked) => setValue("finishedBook", !!checked)}
            />
            <label
              htmlFor="finishedBook"
              className="text-sm text-secondary-foreground font-medium"
            >
              Книга дочитана
            </label>
          </div>

          <Separator />

          <FieldTags
            label="ТЕГИ"
            value={watch("tags")}
            onChange={(tags) => setValue("tags", tags)}
            hint={HINTS.SESSION_TAGS}
          />

          <Separator />

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              ЗАМЕТКИ
            </label>
            <Textarea
              {...register("notes")}
              placeholder="Ваши заметки о сессии"
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
      </FormProvider>
    </AddModal>
  );
}
