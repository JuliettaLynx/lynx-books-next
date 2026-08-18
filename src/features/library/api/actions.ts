"use server";

import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import clientPromise, { dbName } from "@/shared/lib/db";
import { deleteBlobFile } from "@/shared/lib/blob";
import type { LibraryBook } from "@/shared/models/Book";
import {
  AddBookSchema,
  type AddBookInput,
} from "@/features/library/model/validation";

export async function addBookAction(input: AddBookInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Необходимо авторизоваться" };
  }
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) {
    return { success: false, error: "Не удалось определить пользователя" };
  }

  const validated = AddBookSchema.safeParse(input);
  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message || "Ошибка валидации";
    return { success: false, error: firstError };
  }

  const data = validated.data;

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const books = db.collection("books");

    const newBook = {
      userId,
      title: data.title,
      author: data.author,
      pages: data.pages,
      publisher: data.publisher || undefined,
      series: data.series || undefined,
      isbn: data.isbn || undefined,
      annotation: data.annotation || undefined,
      cover: data.cover || undefined,
      tags: data.tags || [],
      readingStatus: data.readingStatus,
      format: data.format,
      isFavorite: false,
      rating: data.rating ?? 0,
      review: data.review || undefined,
      quotes: data.quotes || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await books.insertOne(newBook);
    return { success: true, error: undefined };
  } catch (error) {
    console.error("addBookAction error:", error);
    return { success: false, error: "Ошибка при сохранении книги" };
  }
}

export async function toggleFavoriteAction(bookId: string) {
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
    const books = db.collection("books");

    const result = await books.updateOne(
      { _id: new ObjectId(bookId), userId },
      { $set: { isFavorite: true, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Книга не найдена" };
    }
    return { success: true, error: undefined };
  } catch (error) {
    console.error("toggleFavoriteAction error:", error);
    return { success: false, error: "Ошибка при обновлении" };
  }
}

export async function deleteBookAction(bookId: string) {
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
    const books = db.collection("books");

    const bookToDelete = await books.findOne({
      _id: new ObjectId(bookId),
      userId,
    });
    if (!bookToDelete) {
      return { success: false, error: "Книга не найдена" };
    }

    if (bookToDelete.cover) {
      await deleteBlobFile(bookToDelete.cover);
    }

    const result = await books.deleteOne({ _id: new ObjectId(bookId), userId });

    if (result.deletedCount === 0) {
      return { success: false, error: "Книга не найдена" };
    }
    return { success: true, error: undefined };
  } catch (error) {
    console.error("deleteBookAction error:", error);
    return { success: false, error: "Ошибка при удалении книги" };
  }
}

export async function updateBookAction(bookId: string, input: AddBookInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Необходимо авторизоваться" };
  }
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) {
    return { success: false, error: "Не удалось определить пользователя" };
  }

  const validated = AddBookSchema.safeParse(input);
  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message || "Ошибка валидации";
    return { success: false, error: firstError };
  }

  const data = validated.data;

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const books = db.collection("books");

    const existingBook = await books.findOne({
      _id: new ObjectId(bookId),
      userId,
    });
    if (!existingBook) {
      return { success: false, error: "Книга не найдена" };
    }

    const oldCover = existingBook.cover;
    const newCover = data.cover;

    if (oldCover && newCover && oldCover !== newCover) {
      await deleteBlobFile(oldCover);
    }

    const result = await books.updateOne(
      { _id: new ObjectId(bookId), userId },
      {
        $set: {
          title: data.title,
          author: data.author,
          pages: data.pages,
          publisher: data.publisher || undefined,
          series: data.series || undefined,
          isbn: data.isbn || undefined,
          annotation: data.annotation || undefined,
          cover: newCover || undefined,
          tags: data.tags || [],
          readingStatus: data.readingStatus,
          format: data.format,
          rating: data.rating ?? 0,
          review: data.review || undefined,
          quotes: data.quotes || [],
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Книга не найдена" };
    }
    return { success: true, error: undefined };
  } catch (error) {
    console.error("updateBookAction error:", error);
    return { success: false, error: "Ошибка при обновлении книги" };
  }
}

export async function getBooks(): Promise<LibraryBook[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) return [];

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const books = db.collection("books");
    const result = await books.find({ userId }).toArray();

    return result.map((book) => ({
      ...book,
      _id: book._id.toString(),
    })) as LibraryBook[];
  } catch (error) {
    console.error("getBooks error:", error);
    return [];
  }
}
