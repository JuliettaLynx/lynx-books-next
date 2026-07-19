import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/db";
import { ObjectId } from "mongodb";

// GET — получить книгу из каталога по ID (с полным массивом editions)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(dbName);

    const book = await db.collection("catalog").findOne({
      _id: new ObjectId(id),
    });

    if (!book) {
      return NextResponse.json(
        { error: "Книга не найдена в каталоге" },
        { status: 404 },
      );
    }

    const formatted = {
      _id: book._id.toString(),
      title: book.title,
      author: book.author ?? "",
      genres: book.genres ?? [],
      description: book.description ?? null,
      editions: (book.editions ?? []).map((e: any) => ({
        publisher: e.publisher ?? "",
        series: e.series ?? null,
        pageCount: e.pageCount ?? 0,
        isbn: e.isbn ?? null,
        coverImageUrl: e.coverImageUrl ?? null,
        language: e.language ?? "ru",
        format: e.format ?? "",
      })),
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Get catalog book error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки из каталога" },
      { status: 500 },
    );
  }
}
