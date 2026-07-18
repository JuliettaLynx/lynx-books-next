import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { dbName } from "@/lib/db";
import { ObjectId } from "mongodb";

/**
 * Возвращает MongoDB коллекцию пользователей.
 */
export async function getUsersCollection() {
  const client = await clientPromise;
  return client.db(dbName).collection("users");
}

/**
 * Возвращает ID текущего пользователя из сессии NextAuth.
 * Бросает ошибку, если пользователь не авторизован.
 */
export async function getCurrentUserId(): Promise<ObjectId> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ email: session.user.email });

  if (!user) {
    throw new Error("User not found");
  }

  return user._id;
}

/**
 * Возвращает документ текущего пользователя.
 * Бросает ошибку, если не авторизован.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const users = await getUsersCollection();
  const user = await users.findOne(
    { email: session.user.email },
    { projection: { passwordHash: 0 } }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
