"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema, RegisterInput } from "@/models/User";
import AuthFormField from "@/components/shared/AuthFormField";
import { useFormNavigation } from "@/hooks/useFormNavigation";

import { Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onChange",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const values = registerForm.getValues();
      const fieldsToValidate: (keyof RegisterInput)[] = [];

      if (values.name?.trim()) fieldsToValidate.push("name");
      if (values.email?.trim()) fieldsToValidate.push("email");
      if (values.password?.trim()) fieldsToValidate.push("password");

      if (fieldsToValidate.length > 0) {
        setTouched((prev) => ({
          ...prev,
          ...Object.fromEntries(fieldsToValidate.map((f) => [f, true])),
        }));
        registerForm.trigger(fieldsToValidate as any);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [registerForm]);

  const { handleEnter } = useFormNavigation();

  const handleBlur = async (fieldName: keyof RegisterInput) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    await registerForm.trigger(fieldName);
  };

  const toggleMode = () => {
    setError("");
    setShowPassword(false);
    registerForm.reset();
    router.push("/auth/login");
  };

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed min-h-screen min-w-full bg-background flex items-center justify-center p-4">
      <div className="bg-secondary rounded-2xl p-6 w-full max-w-sm -bg-linear-20 from-background/50 via-secondary/30 to-accent/70">
        <h1 className="text-foreground text-2xl tracking-wider font-bold text-center pb-4">
          Регистрация
        </h1>

        <form
          onSubmit={registerForm.handleSubmit(handleRegister)}
          className="space-y-4"
        >
          <FieldGroup className="gap-4">
            <AuthFormField
              name="name"
              control={registerForm.control}
              placeholder="John Doe"
              icon={<User className="text-muted-foreground w-5 h-5" />}
              onEnter={handleEnter}
              onBlurHandler={() => handleBlur("name")}
              touched={touched}
              errors={registerForm.formState.errors}
            />

            <AuthFormField
              name="email"
              control={registerForm.control}
              placeholder="your@email.com"
              icon={<Mail className="text-muted-foreground w-5 h-5" />}
              type="email"
              autoComplete="email"
              onEnter={handleEnter}
              onBlurHandler={() => handleBlur("email")}
              touched={touched}
              errors={registerForm.formState.errors}
            />

            <AuthFormField
              name="password"
              control={registerForm.control}
              placeholder="••••••"
              icon={<Lock className="text-muted-foreground w-5 h-5" />}
              type={showPassword ? "text" : "password"}
              onEnter={handleEnter}
              onBlurHandler={() => handleBlur("password")}
              touched={touched}
              errors={registerForm.formState.errors}
              showPasswordToggle
              passwordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary hover:bg-primary/80 font-medium text-secondary rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                Загрузка…
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline font-medium ml-1"
            >
              Войти
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
