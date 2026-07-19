import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/db";
import type { CatalogBook, CatalogSearchResult } from "@/models/Catalog";

// GET — поиск книг в каталоге
// Разворачивает editions: каждое издание — отдельный результат
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.trim().length < 1) {
      return NextResponse.json(
        { error: "Введите поисковый запрос" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    // Поиск по названию и автору (регистронезависимый)
    const regex = new RegExp(query.trim(), "i");
    const books = await db
      .collection("catalog")
      .find({
        $or: [{ title: regex }, { author: regex }],
      })
      .limit(limit)
      .toArray();

    // Разворачиваем editions: каждое издание — отдельный результат
    const results: CatalogSearchResult[] = [];
    for (const book of books as unknown as CatalogBook[]) {
      const editions = book.editions ?? [];
      for (const edition of editions) {
        results.push({
          _id: book._id!.toString(),
          title: book.title,
          author: book.author,
          genres: book.genres ?? [],
          description: book.description ?? null,
          edition: {
            publisher: edition.publisher ?? "",
            series: edition.series ?? null,
            pageCount: edition.pageCount ?? 0,
            isbn: edition.isbn ?? null,
            coverImageUrl: edition.coverImageUrl ?? null,
            language: edition.language ?? "ru",
            format: edition.format ?? "",
          },
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Catalog search error:", error);
    return NextResponse.json(
      { error: "Ошибка поиска каталога" },
      { status: 500 },
    );
  }
}
