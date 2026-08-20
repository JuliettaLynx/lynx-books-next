"use server";

import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import clientPromise, { dbName } from "@/shared/lib/db";
import {
  createReadingSessionSchema,
  updateReadingSessionSchema,
  type CreateReadingSessionInput,
  type UpdateReadingSessionInput,
} from "@/features/tracker/model/validation";
import type { ReadingSession } from "@/shared/models/ReadingSession";

// ========== Вспомогательные функции ==========

function calculatePagesRead(
  startPage?: number | null,
  endPage?: number | null,
): number {
  if (startPage != null && endPage != null && startPage <= endPage) {
    return endPage - startPage + 1;
  }
  return 0;
}

function calculateDurationMinutes(startDate: Date, endDate: Date): number {
  if (!startDate || !endDate) return 0;
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / (1000 * 60));
}

// ========== Server Actions ==========

export async function getSessionsForMonth(
  year: number,
  month: number,
): Promise<ReadingSession[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) return [];

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("sessions");

    const startOfMonth = new Date(year, month, 1);
    const startOfNextMonth = new Date(year, month + 1, 1);

    const docs = await collection
      .find({
        userId,
        startDate: { $gte: startOfMonth, $lt: startOfNextMonth },
      })
      .toArray();

    return docs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      startDate: doc.startDate,
      endDate: doc.endDate,
      startPage: doc.startPage ?? undefined,
      endPage: doc.endPage ?? undefined,
      pagesRead: doc.pagesRead ?? 0,
      durationMinutes: doc.durationMinutes ?? 0,
      notes: doc.notes ?? undefined,
    })) as ReadingSession[];
  } catch (error) {
    console.error("getSessionsForMonth error:", error);
    return [];
  }
}

export async function createSession(data: CreateReadingSessionInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Необходимо авторизоваться" };
  }
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) {
    return { success: false, error: "Не удалось определить пользователя" };
  }

  const validated = createReadingSessionSchema.safeParse(data);
  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message || "Ошибка валидации";
    return { success: false, error: firstError };
  }

  const validData = validated.data;

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("sessions");

    const pagesRead = calculatePagesRead(
      validData.startPage,
      validData.endPage,
    );
    const durationMinutes = calculateDurationMinutes(
      validData.startDate,
      validData.endDate,
    );

    const newSession = {
      userId,
      bookId: validData.bookId,
      bookTitle: validData.bookTitle,
      colorIndex: validData.colorIndex,
      startDate: validData.startDate,
      endDate: validData.endDate,
      startPage: validData.startPage ?? undefined,
      endPage: validData.endPage ?? undefined,
      pagesRead,
      durationMinutes,
      finishedBook: validData.finishedBook,
      tags: validData.tags,
      notes: validData.notes ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newSession);
    return {
      success: true,
      id: result.insertedId.toString(),
      error: undefined,
    };
  } catch (error) {
    console.error("createSession error:", error);
    return { success: false, error: "Ошибка при сохранении сессии" };
  }
}

export async function updateSession(
  id: string,
  data: UpdateReadingSessionInput,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Необходимо авторизоваться" };
  }
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) {
    return { success: false, error: "Не удалось определить пользователя" };
  }

  const validated = updateReadingSessionSchema.safeParse(data);
  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message || "Ошибка валидации";
    return { success: false, error: firstError };
  }

  const validData = validated.data;

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("sessions");

    const existing = await collection.findOne({
      _id: new ObjectId(id),
      userId,
    });
    if (!existing) {
      return { success: false, error: "Сессия не найдена" };
    }

    const startPage =
      validData.startPage !== undefined
        ? validData.startPage
        : existing.startPage;
    const endPage =
      validData.endPage !== undefined ? validData.endPage : existing.endPage;
    const pagesRead = calculatePagesRead(startPage, endPage);

    const startDate = validData.startDate ?? existing.startDate;
    const endDate = validData.endDate ?? existing.endDate;
    const durationMinutes = calculateDurationMinutes(startDate, endDate);

    const updateFields: any = {
      ...validData,
      pagesRead,
      durationMinutes,
      updatedAt: new Date(),
    };

    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updateFields },
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Сессия не найдена" };
    }
    return { success: true, error: undefined };
  } catch (error) {
    console.error("updateSession error:", error);
    return { success: false, error: "Ошибка при обновлении сессии" };
  }
}

export async function deleteSession(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Необходимо авторизоваться" };
  }
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) {
    return { success: false, error: "Не удалось определить пользователя" };
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("sessions");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });
    if (result.deletedCount === 0) {
      return { success: false, error: "Сессия не найдена" };
    }
    return { success: true, error: undefined };
  } catch (error) {
    console.error("deleteSession error:", error);
    return { success: false, error: "Ошибка при удалении сессии" };
  }
}
