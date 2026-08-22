import { z } from "zod";
import { SESSION_COLORS } from "@/shared/constants/colors";

const SessionFieldsSchema = z.object({
  bookId: z.string().min(1, "Выберите книгу"),
  bookTitle: z.string().min(1, "Название книги обязательно"),
  colorIndex: z
    .number()
    .int()
    .min(0)
    .max(SESSION_COLORS.length - 1, "Некорректный цвет"),
  startDate: z.date("Дата начала обязательна"),
  endDate: z.date("Дата окончания обязательна"),
  startPage: z
    .number("Обязательно")
    .int()
    .positive("Начальная страница должна быть положительным числом"),
  endPage: z
    .number("Обязательно")
    .int()
    .positive("Конечная страница должна быть положительным числом"),
  finishedBook: z.boolean(),
  tags: z.array(z.string()),
  notes: z.string().optional().nullable(),
});

export const createReadingSessionSchema = SessionFieldsSchema.superRefine(
  (data, ctx) => {
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Дата начала не может быть позже даты окончания",
        path: ["startDate"],
      });
    }
    if (data.startPage > data.endPage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Начальная страница не может быть больше конечной",
        path: ["startPage"],
      });
    }
  },
);

export const updateReadingSessionSchema =
  SessionFieldsSchema.partial().superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Дата начала не может быть позже даты окончания",
        path: ["startDate"],
      });
    }
    if (
      data.startPage != null &&
      data.endPage != null &&
      data.startPage > data.endPage
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Начальная страница не может быть больше конечной",
        path: ["startPage"],
      });
    }
  });

export type CreateReadingSessionInput = z.infer<
  typeof createReadingSessionSchema
>;
export type UpdateReadingSessionInput = z.infer<
  typeof updateReadingSessionSchema
>;
