"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";

import { LoginSchema, LoginInput } from "@/models/User";
import { FieldGroup } from "@/components/ui/field";
import AuthFormField from "@/components/features/auth/AuthFormField";
import AuthLayout from "@/components/layout/AuthLayout";
import { useFormTouched } from "@/hooks/useFormTouched";
import { useFormNavigation } from "@/hooks/useFormNavigation";
import { showSuccess, showError } from "@/lib/toast";

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

  const { touched, handleBlur } = useFormTouched(loginForm, [
    "email",
    "password",
  ]);

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
        showError(result.error);
        setError(result.error);
      } else {
        showSuccess("Выполняется вход...");
        router.push("/library");
        router.refresh();
      }
    } catch {
      showError("Произошла неизвестная ошибка");
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
    <AuthLayout
      title="Вход"
      onSubmit={loginForm.handleSubmit(handleLogin)}
      submitText="Войти"
      loading={loading}
      error={error}
      toggleLink={
        <>
          Нет аккаунта?{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline font-medium ml-1"
          >
            Создать
          </button>
        </>
      }
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
          onBlurHandler={() => handleBlur("email")}
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
          onBlurHandler={() => handleBlur("password")}
          touched={touched}
          errors={loginForm.formState.errors}
          showPasswordToggle
          passwordVisible={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </FieldGroup>
    </AuthLayout>
  );
}
