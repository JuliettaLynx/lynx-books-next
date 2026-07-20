import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put, del, head } from "@vercel/blob";
import clientPromise, { dbName } from "@/lib/db";

// POST – загрузка нового аватара
export async function POST(req: NextRequest) {
  if (!process.env.USERS_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Хранилище не настроено" },
      { status: 500 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Проверка типа и размера
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );
  }

  const storeId = process.env.USERS_STORE_ID;

  if (!storeId) {
    console.error("USERS_STORE_ID is not set");
    return NextResponse.json(
      { error: "Хранилище не настроено" },
      { status: 500 },
    );
  }

  // Сохраняем URL в БД
  const client = await clientPromise;
  const db = client.db(dbName);

  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });
  const oldAvatarUrl = user?.avatar;

  // Генерируем уникальное имя
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `avatars/${session.user.email}-${Date.now()}.${ext}`;

  // Загружаем в Blob
  const blob = await put(fileName, file, {
    storeId: storeId,
    access: "public",
    contentType: file.type,
    token: process.env.USERS_READ_WRITE_TOKEN,
  });

  await db
    .collection("users")
    .updateOne({ email: session.user.email }, { $set: { avatar: blob.url } });

  if (oldAvatarUrl) {
    try {
      await del(oldAvatarUrl, {
        token: process.env.USERS_READ_WRITE_TOKEN, // <-- и тут
      });
    } catch (e) {
      console.warn("Failed to delete old avatar:", e);
    }
  }
  // Обновляем сессию (на клиенте вызовется updateSession)
  return NextResponse.json({ avatar: blob.url });
}

// DELETE – удаление аватара
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db(dbName);
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });
  const avatarUrl = user?.avatar;

  if (avatarUrl) {
    try {
      await del(avatarUrl, {
        token: process.env.USERS_READ_WRITE_TOKEN,
      });
    } catch (e) {
      console.warn("Failed to delete blob:", e);
    }
  }

  // Очищаем поле avatar в БД
  await db
    .collection("users")
    .updateOne({ email: session.user.email }, { $set: { avatar: null } });

  return NextResponse.json({ avatar: null });
}
