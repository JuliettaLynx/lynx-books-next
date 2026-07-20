import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { dbName } from "@/lib/db";
import { BookSchema } from "@/models/Book";
import { ObjectId } from "mongodb";

// GET — получить одну книгу
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const book = await db.collection("books").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!book) {
      return NextResponse.json({ error: "Книга не найдена" }, { status: 404 });
    }

    const formatted = {
      ...book,
      _id: book._id.toString(),
      author: book.author ?? null,
      publisher: book.publisher ?? null,
      series: book.series ?? null,
      pages: book.pages ?? null,
      genres: book.genres ?? [],
      format: book.format ?? "бумажная",
      status: book.status ?? "не прочитано",
      rating: book.rating ?? 0,
      review: book.review ?? null,
      annotation: book.annotation ?? null,
      quotes: book.quotes ?? [],
      description: book.description ?? null,
      isFavorite: book.isFavorite ?? false,
      cover: book.cover ?? null,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Get book error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки книги" },
      { status: 500 },
    );
  }
}

// PUT — обновить книгу
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = BookSchema.partial().parse(body);

    const client = await clientPromise;
    const db = client.db(dbName);

    const update: Record<string, unknown> = {
      ...validated,
      updatedAt: new Date(),
    };

    // Удаляем undefined значения
    Object.keys(update).forEach(
      (key) => update[key] === undefined && delete update[key],
    );

    const result = await db
      .collection("books")
      .findOneAndUpdate(
        { _id: new ObjectId(id), userId: session.user.id },
        { $set: update },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json({ error: "Книга не найдена" }, { status: 404 });
    }

    const updated = {
      ...result,
      _id: result._id.toString(),
      author: result.author ?? null,
      publisher: result.publisher ?? null,
      series: result.series ?? null,
      pages: result.pages ?? null,
      genres: result.genres ?? [],
      format: result.format ?? "бумажная",
      status: result.status ?? "не прочитано",
      rating: result.rating ?? 0,
      review: result.review ?? null,
      annotation: result.annotation ?? null,
      quotes: result.quotes ?? [],
      description: result.description ?? null,
      isFavorite: result.isFavorite ?? false,
      cover: result.cover ?? null,
    };

    return NextResponse.json(updated);
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

// DELETE — удалить книгу
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db.collection("books").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Книга не найдена" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete book error:", error);
    return NextResponse.json(
      { error: "Ошибка удаления книги" },
      { status: 500 },
    );
  }
}
