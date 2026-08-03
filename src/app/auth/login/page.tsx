"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema, LoginInput } from "@/models/User";
import AuthFormField from "@/components/shared/AuthFormField";
import { useFormNavigation } from "@/hooks/useFormNavigation";

import { Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const touched = {
    email: !!loginForm.formState.touchedFields.email,
    password: !!loginForm.formState.touchedFields.password,
  };

  const { handleEnter } = useFormNavigation();

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
      } else {
        router.push("/library");
        router.refresh();
      }
    } catch {
      setError("Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    setShowPassword(false);
    loginForm.reset();
    router.push("/auth/register");
  };

  return (
    <div className="fixed min-h-screen min-w-full bg-background flex items-center justify-center p-4">
      <div className="bg-secondary rounded-2xl p-6 w-full max-w-sm -bg-linear-20 from-background/50 via-secondary/30 to-accent/70">
        <h1 className="text-foreground text-2xl tracking-wider font-bold text-center pb-4">
          Вход
        </h1>

        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="space-y-4"
        >
          <FieldGroup className="gap-4">
            <AuthFormField
              name="email"
              control={loginForm.control}
              placeholder="your@email.com"
              icon={<Mail className="text-muted-foreground w-5 h-5" />}
              type="email"
              autoComplete="email"
              onEnter={handleEnter}
              onBlurHandler={() => loginForm.trigger("email")}
              touched={touched}
              errors={loginForm.formState.errors}
            />

            <AuthFormField
              name="password"
              control={loginForm.control}
              placeholder="••••••"
              icon={<Lock className="text-muted-foreground w-5 h-5" />}
              type={showPassword ? "text" : "password"}
              onEnter={handleEnter}
              onBlurHandler={() => loginForm.trigger("password")}
              touched={touched}
              errors={loginForm.formState.errors}
              showPasswordToggle
              passwordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </FieldGroup>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary hover:bg-primary/80 font-medium text-secondary rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-bg-primary" />
                Загрузка…
              </>
            ) : (
              "Войти"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Нет аккаунта?
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline font-medium ml-1"
            >
              Создать
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
