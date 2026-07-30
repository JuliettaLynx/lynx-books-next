"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, Check, Mail, Lock, User } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import {
  LoginSchema,
  RegisterSchema,
  LoginInput,
  RegisterInput,
} from "@/models/User";

export default function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Форма входа ──
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  // ── Форма регистрации ──
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onChange",
  });

  // ── Обработчик Enter (без ref) ──
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (!form) return;
      const inputs = Array.from(
        form.querySelectorAll<HTMLInputElement>("input:not([disabled])"),
      );
      const currentIndex = inputs.indexOf(e.currentTarget);
      const nextIndex = currentIndex + 1;
      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
      }
    }
  };

  // ── Вход ──────────────────────────────────────────────
  const handleLogin = async (data: LoginInput) => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
        showError("Неверный email или пароль");
      } else {
        showSuccess("Вход выполнен успешно");
        router.push("/library");
        router.refresh();
      }
    } catch {
      setError("Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  // ── Регистрация ──────────────────────────────────────
  const handleRegister = async (data: RegisterInput) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка регистрации");
      }
      showSuccess("Регистрация успешна! Выполняется вход…");

      // Автоматический вход после регистрации
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/library");
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка регистрации";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Переключение режима ──────────────────────────────
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setShowPassword(false);
    loginForm.reset();
    registerForm.reset();
  };

  // ── Классы ────────────────────────────────────────────
  const inputClass =
    "w-full px-4 py-2 bg-field border border-border rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50";
  const errorClass = "text-red-500 text-sm mt-1";
  const submitClass =
    "w-full py-3 bg-accent hover:bg-accent/80 font-medium text-bg-primary rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const renderCheckIcon = (
    dirty: boolean | undefined,
    fieldError: { message?: string } | undefined,
  ) => {
    if (dirty && !fieldError) {
      return <Check className="text-accent w-5 h-5" />;
    }
    return null;
  };

  // ── Рендер ────────────────────────────────────────────
  return (
    <div className="fixed min-h-screen min-w-full bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-bg-secondary text-white rounded-t-2xl pt-4">
          <h1 className="text-2xl tracking-wider font-bold text-center">
            {isLoginMode ? "Вход" : "Регистрация"}
          </h1>
        </div>

        <div className="bg-bg-secondary rounded-b-2xl p-6 shadow-lg">
          {isLoginMode ? (
            /* ── Форма входа ── */
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...loginForm.register("email")}
                    autoComplete="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`${inputClass} pl-10`}
                    onKeyDown={handleEnter}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className={errorClass}>
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Пароль */}
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...loginForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="* * * * * *"
                    className={`${inputClass} pl-10 pr-10`}
                    onKeyDown={handleEnter}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className={errorClass}>
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Кнопка */}
              <button type="submit" disabled={loading} className={submitClass}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-bg-primary" />
                    Загрузка…
                  </>
                ) : (
                  "Войти"
                )}
              </button>

              {/* Переключение */}
              <p className="text-center text-sm text-gray-400 mt-4">
                Нет аккаунта?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-accent hover:underline font-medium ml-1"
                >
                  Создать
                </button>
              </p>
            </form>
          ) : (
            /* ── Форма регистрации ── */
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              {/* Имя */}
              <div className="space-y-1">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...registerForm.register("name")}
                    autoComplete="off"
                    type="text"
                    placeholder="Как к вам обращаться?"
                    className={`${inputClass} pl-10 pr-14`}
                    onKeyDown={handleEnter}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {renderCheckIcon(
                      registerForm.formState.dirtyFields.name,
                      registerForm.formState.errors.name,
                    )}
                  </div>
                </div>
                {registerForm.formState.errors.name && (
                  <p className={errorClass}>
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...registerForm.register("email")}
                    autoComplete="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`${inputClass} pl-10 pr-14`}
                    onKeyDown={handleEnter}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {renderCheckIcon(
                      registerForm.formState.dirtyFields.email,
                      registerForm.formState.errors.email,
                    )}
                  </div>
                </div>
                {registerForm.formState.errors.email && (
                  <p className={errorClass}>
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Пароль */}
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...registerForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="* * * * * *"
                    className={`${inputClass} pl-10 pr-14`}
                    onKeyDown={handleEnter}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {renderCheckIcon(
                      registerForm.formState.dirtyFields.password,
                      registerForm.formState.errors.password,
                    )}
                  </div>
                </div>
                {registerForm.formState.errors.password && (
                  <p className={errorClass}>
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Кнопка */}
              <button type="submit" disabled={loading} className={submitClass}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-bg-primary" />
                    Загрузка…
                  </>
                ) : (
                  "Зарегистрироваться"
                )}
              </button>

              {/* Переключение */}
              <p className="text-center text-sm text-gray-400 mt-4">
                Уже есть аккаунт?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-accent hover:underline font-medium ml-1 z-10"
                >
                  Войти
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
