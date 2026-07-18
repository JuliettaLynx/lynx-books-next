"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary dark:bg-bg-primary-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary dark:bg-bg-primary-dark p-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="bg-bg-secondary dark:bg-bg-secondary-dark rounded-2xl shadow-lg p-8 border border-border dark:border-border-dark">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Библиотека
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Добро пожаловать, {session?.user?.name || "пользователь"}!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Email: {session?.user?.email}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border-t border-border dark:border-border-dark pt-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Авторизация работает. Остальные разделы — в разработке.
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/auth" })}
            className="mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
