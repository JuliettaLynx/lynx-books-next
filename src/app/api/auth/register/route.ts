import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import clientPromise, { dbName } from "@/lib/db";
import { RegisterSchema } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RegisterSchema.parse(body);

    const client = await clientPromise;
    const db = client.db(dbName);
    const users = db.collection("users");

    // Проверяем, не занят ли email
    const existing = await users.findOne({ email: validated.email });

    if (existing) {
      return NextResponse.json(
        { error: "Этот email уже зарегистрирован" },
        { status: 409 },
      );
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(validated.password, 10);

    // Создаём пользователя
    const now = new Date();
    const newUser = {
      name: validated.name.trim(),
      email: validated.email,
      passwordHash,
      avatar: null,
      originalAvatar: null,
      dailyGoal: 50,
      isLibraryPublic: false,
      isWishlistPublic: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.insertedId.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }

    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 },
    );
  }
}
