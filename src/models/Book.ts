import { z } from "zod";

// === Типы для книги ===
export type BookFormat = "бумажная" | "электронная" | "аудио";
export type BookStatus = "не прочитано" | "прочитано" | "брошено";

export interface Book {
  _id: string;
  userId: string;
  title: string;
  author: string | null;
  publisher: string | null;
  series: string | null;
  pages: number | null;
  genres: string[];
  format: BookFormat;
  status: BookStatus;
  rating: number;
  review: string | null;
  annotation: string | null;
  quotes: string[];
  description: string | null;
  isFavorite: boolean;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// === Схема добавления/редактирования книги ===
export const BookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Введите название книги")
    .max(200, "Название слишком длинное"),
  author: z.string().trim().max(100).nullable().optional().default(null),
  publisher: z.string().trim().max(100).nullable().optional().default(null),
  series: z.string().trim().max(100).nullable().optional().default(null),
  pages: z.number().int().min(1).max(99999).nullable().optional().default(null),
  genres: z.array(z.string().trim().max(50)).default([]),
  format: z.enum(["бумажная", "электронная", "аудио"]).default("бумажная"),
  status: z
    .enum(["не прочитано", "прочитано", "брошено"])
    .default("не прочитано"),
  rating: z.number().min(0).max(5).default(0),
  review: z.string().trim().max(5000).nullable().optional().default(null),
  annotation: z.string().trim().max(5000).nullable().optional().default(null),
  quotes: z.array(z.string().trim().max(2000)).default([]),
  description: z.string().trim().max(5000).nullable().optional().default(null),
  cover: z.string().nullable().optional().default(null),
  isFavorite: z.boolean().default(false),
});

export type BookInput = z.infer<typeof BookSchema>;
