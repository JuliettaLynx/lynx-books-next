import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { dbName } from "@/lib/db";
import { BookSchema } from "@/models/Book";

// GET — получить все книги пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const books = await db
      .collection("books")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = books.map((b) => ({
      ...b,
      _id: b._id.toString(),
      author: b.author ?? null,
      publisher: b.publisher ?? null,
      series: b.series ?? null,
      pages: b.pages ?? null,
      genres: b.genres ?? [],
      format: b.format ?? "бумажная",
      status: b.status ?? "не прочитано",
      rating: b.rating ?? 0,
      review: b.review ?? null,
      annotation: b.annotation ?? null,
      quotes: b.quotes ?? [],
      description: b.description ?? null,
      isFavorite: b.isFavorite ?? false,
      cover: b.cover ?? null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Get books error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки книг" },
      { status: 500 },
    );
  }
}

// POST — создать новую книгу
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();
    const validated = BookSchema.parse(body);

    const client = await clientPromise;
    const db = client.db(dbName);

    const now = new Date();
    const newBook = {
      ...validated,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("books").insertOne(newBook);

    const created = {
      ...newBook,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Ошибка валидации",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
