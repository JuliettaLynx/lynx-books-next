import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import clientPromise, { dbName } from "@/lib/db";
import { PALETTES } from "@/lib/palettes";
import { UpdateUserSchema, UpdateUserInput } from "@/models/User";

// PATCH - обновление профиля пользователя
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();
    const validation = UpdateUserSchema.safeParse(body);
    if (!validation.success) {
      // Возвращаем первую ошибку валидации
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }
    const data = validation.data;

    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const updateData: Record<string, any> = {};
    const now = new Date();
    updateData.updatedAt = now;

    // --- Обработка простых полей (исключаем avatar, его обновляем отдельно) ---
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.dailyGoal !== undefined) {
      updateData.dailyGoal = data.dailyGoal;
    }
    if (data.paletteIndex !== undefined) {
      updateData.paletteIndex = data.paletteIndex;
    }

    // --- Обработка email (с проверкой уникальности) ---
    if (data.email !== undefined && data.email !== session.user.email) {
      const existingUser = await usersCollection.findOne({ email: data.email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Пользователь с таким email уже существует" },
          { status: 409 },
        );
      }
      updateData.email = data.email;
    }

    // --- Обработка смены пароля (с проверкой текущего) ---
    if (data.password) {
      if (!data.currentPassword) {
        return NextResponse.json(
          { error: "Текущий пароль обязателен для смены пароля" },
          { status: 400 },
        );
      }

      const user = await usersCollection.findOne({ email: session.user.email });
      if (!user || !user.passwordHash) {
        return NextResponse.json(
          { error: "Пользователь не найден или не имеет пароля" },
          { status: 404 },
        );
      }

      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Неверный текущий пароль" },
          { status: 400 },
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);
      updateData.passwordHash = hashedPassword;
    }

    if (Object.keys(updateData).length === 1 && updateData.updatedAt) {
      return NextResponse.json(
        { error: "Нет данных для обновления" },
        { status: 400 },
      );
    }

    const result = await usersCollection.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Профиль обновлён",
      user: {
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        dailyGoal: result.dailyGoal,
        paletteIndex: result.paletteIndex,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Ошибка обновления профиля" },
      { status: 500 },
    );
  }
}
