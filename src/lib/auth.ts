import { ObjectId } from "mongodb";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise, { dbName } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.avatar = user.avatar || null;
        token.dailyGoal = user.dailyGoal || 50;
        token.paletteIndex = user.paletteIndex ?? 0;
      }

      // При обновлении сессии (trigger === "update")
      if (trigger === "update" && token.email) {
        try {
          const client = await clientPromise;
          const db = client.db(dbName);
          const usersCollection = db.collection("users");
          const userFromDb = await usersCollection.findOne({
            _id: new ObjectId(token.id as string),
          });

          if (userFromDb) {
            token.name = userFromDb.name;
            token.email = userFromDb.email;
            token.avatar = userFromDb.avatar || null;
            token.dailyGoal = userFromDb.dailyGoal || 50;
            token.paletteIndex = userFromDb.paletteIndex ?? 0;
          }
        } catch (error) {
          console.error("Failed to refresh token data:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.avatar = (token.avatar as string) || null;
        session.user.dailyGoal = (token.dailyGoal as number) || 50;
        session.user.paletteIndex = (token.paletteIndex as number) ?? 0;
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email и пароль обязательны");
        }

        const client = await clientPromise;
        const db = client.db(dbName);
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email.toLowerCase().trim(),
        });

        if (!user) {
          throw new Error("Пользователь с таким email не найден");
        }

        if (!user.passwordHash) {
          throw new Error("Неверные учетные данные");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          throw new Error("Неверный пароль");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          avatar: user.avatar || null,
          dailyGoal: user.dailyGoal || 50,
          paletteIndex: user.paletteIndex ?? 0,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,
};
