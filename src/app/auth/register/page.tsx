"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterInput } from "@/models/User";
import { Mail, Lock, User } from "lucide-react";

import { FieldGroup } from "@/components/ui/field";
import AuthFormField from "@/components/shared/AuthFormField";
import AuthLayout from "@/components/layout/AuthLayout";
import { useFormTouched } from "@/hooks/useFormTouched";
import { useFormNavigation } from "@/hooks/useFormNavigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onChange",
  });

  const { touched, handleBlur } = useFormTouched(registerForm, [
    "name",
    "email",
    "password",
  ]);

  const { handleEnter } = useFormNavigation();

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

  const toggleMode = () => {
    setError("");
    setShowPassword(false);
    registerForm.reset();
    router.push("/auth/login");
  };

  return (
    <AuthLayout
      title="Регистрация"
      onSubmit={registerForm.handleSubmit(handleRegister)}
      submitText="Зарегистрироваться"
      loading={loading}
      error={error}
      toggleLink={
        <>
          Уже есть аккаунт?{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline font-medium ml-1"
          >
            Войти
          </button>
        </>
      }
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
    </AuthLayout>
  );
}
