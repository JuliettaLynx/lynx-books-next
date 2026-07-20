import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import clientPromise, { dbName } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const body = await request.json();
    const { confirmDelete } = body;

    // Обязательное подтверждение
    if (confirmDelete !== true) {
      return NextResponse.json(
        { error: "Для удаления аккаунта необходимо подтвердить действие" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    // Получаем пользователя, чтобы узнать URL аватара
    const user = await db.collection("users").findOne({ email: userEmail });
    const avatarUrl = user?.avatar;

    // Удаляем файл аватара из Blob, если он есть и токен задан
    if (avatarUrl && process.env.USERS_READ_WRITE_TOKEN) {
      try {
        await del(avatarUrl, {
          token: process.env.USERS_READ_WRITE_TOKEN,
        });
      } catch (error) {
        console.warn("Failed to delete avatar blob:", error);
        // Не прерываем удаление аккаунта, если файл не удалился
      }
    }

    // Удаляем все связанные записи в БД
    await db.collection("books").deleteMany({ userId });
    await db.collection("sessions").deleteMany({ userId });
    await db.collection("accounts").deleteMany({ userId });
    await db.collection("verificationTokens").deleteMany({
      identifier: userEmail,
    });

    // Удаляем самого пользователя
    const result = await db.collection("users").deleteOne({ email: userEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Аккаунт успешно удалён",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Ошибка удаления аккаунта" },
      { status: 500 },
    );
  }
}
