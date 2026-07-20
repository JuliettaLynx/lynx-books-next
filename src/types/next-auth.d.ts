import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      avatar: string | null;
      dailyGoal: number;
      paletteIndex: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    avatar: string | null;
    dailyGoal: number;
    paletteIndex: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatar: string | null;
    dailyGoal: number;
    paletteIndex: number;
  }
}
