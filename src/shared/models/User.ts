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
  dailyGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

// === Схема регистрации ===
export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Поле обязательно")
    .min(3, "Имя должно содержать минимум 3 символа")
    .regex(/[a-zA-Zа-яА-ЯёЁ]/, "Имя должно содержать хотя бы одну букву"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty("Поле обязательно")
    .email("Некорректный email-адрес"),
  password: z
    .string()
    .nonempty("Поле обязательно")
    .min(6, "Пароль должен быть не менее 6 символов"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

// === Схема входа ===
export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty("Поле обязательно")
    .email("Некорректный email-адрес"),
  password: z
    .string()
    .nonempty("Поле обязательно")
    .min(6, "Пароль должен быть не менее 6 символов"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// === Схема обновления профиля ===
export const UpdateUserSchema = z.object({
  name: z.string().min(3).max(30).optional(),
  dailyGoal: z.number().min(0).optional(),
  avatar: z.string().url().optional().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
