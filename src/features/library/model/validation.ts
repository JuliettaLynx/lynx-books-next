import { z } from "zod";

export const AddBookSchema = z.object({
  title: z.string().trim().nonempty("Название обязательно").min(1).max(200),
  author: z.string().trim().nonempty("Автор обязателен").min(1).max(150),
  publisher: z.string().trim().max(150).optional(),
  seriesName: z.string().trim().max(150).optional(),
  seriesNumber: z.number().int().positive().optional(),
  isbn: z.string().trim().optional(),
  annotation: z.string().optional(),
  pages: z
    .number()
    .int("Количество страниц должно быть целым числом")
    .positive("Количество страниц должно быть больше 0")
    .optional(),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional(),
  readingStatus: z.enum(["не прочитано", "прочитано", "брошено"]).optional(),
  format: z.enum(["бумажная", "электронная", "аудио"]).optional(),
  rating: z.number().min(0).max(10).optional(),
  review: z.string().optional(),
  quotes: z
    .array(
      z.object({
        text: z.string().min(1, "Текст цитаты обязателен"),
        page: z.number().int().positive().optional(),
      }),
    )
    .optional(),
});

export type AddBookInput = z.infer<typeof AddBookSchema>;
