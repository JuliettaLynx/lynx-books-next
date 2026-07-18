import { ObjectId } from "mongodb";
import { z } from "zod";

// === Интерфейс пользователя ===
export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  emailVerified?: Date | null;
  passwordHash?: string | null;
  avatar?: string | null;
  originalAvatar?: string | null;
  dailyGoal: number;
  isLibraryPublic: boolean;
  isWishlistPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// === Схема регистрации ===
// Базовая схема
const RegisterBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Имя должно содержать минимум 3 символа")
    .max(30, "Имя должно содержать максимум 30 символов"),
  email: z.string().trim().toLowerCase().email("Некорректный email-адрес"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

// Схема для сервера
export const RegisterServerSchema = RegisterBaseSchema;
export type RegisterServerInput = z.infer<typeof RegisterServerSchema>;

// Схема для клиента
export const RegisterSchema = RegisterBaseSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

// === Схема входа ===
export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email-адрес"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// === Схема обновления профиля ===
export const UpdateUserSchema = z.object({
  name: z.string().min(3).max(30).optional(),
  dailyGoal: z.number().min(0).optional(),
  isLibraryPublic: z.boolean().optional(),
  isWishlistPublic: z.boolean().optional(),
  avatar: z.string().url().optional().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
