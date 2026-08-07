import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User } from "lucide-react";

import {
  LoginSchema,
  RegisterSchema,
  LoginInput,
  RegisterInput,
} from "@/shared/models/User";
import { useFormTouched } from "./useFormTouched";
import { useFormNavigation } from "@/hooks/useFormNavigation"; // ✅ исправленный путь
import { showSuccess, showError } from "@/shared/lib/toast";
import { FieldConfig } from "@/features/auth/model/auth-form";

type Mode = "login" | "register";
type FormInput = LoginInput | RegisterInput;

export function useAuthForm(mode: Mode) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === "login";
  const schema = isLogin ? LoginSchema : RegisterSchema;
  const defaultValues = isLogin
    ? { email: "", password: "" }
    : { name: "", email: "", password: "" };

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormInput,
    mode: "onChange",
  });

  const fieldNames = isLogin
    ? ["email", "password"]
    : ["name", "email", "password"];
  const { touched, handleBlur } = useFormTouched(
    form,
    fieldNames as (keyof FormInput)[],
  );
  const { handleEnter } = useFormNavigation();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const performSignIn = async (
    email: string,
    password: string,
    successMessage: string,
  ) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      showError(result.error);
      setError(result.error);
      return false;
    }
    showSuccess(successMessage);
    router.push("/library");
    router.refresh();
    return true;
  };

  const onSubmit = async (data: FormInput) => {
    setLoading(true);
    setError("");
    try {
      if (!isLogin) {
        const regData = data as RegisterInput;
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: regData.name,
            email: regData.email,
            password: regData.password,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const msg = errorData.error || "Ошибка регистрации";
          showError(msg);
          setError(msg);
          return;
        }
        const signedIn = await performSignIn(
          regData.email,
          regData.password,
          "Регистрация успешна, выполняем вход...",
        );
        if (!signedIn) {
          router.push("/auth/login");
          showError(
            "Аккаунт создан, но не удалось войти. Пожалуйста, войдите вручную.",
          );
          return;
        }
      } else {
        const loginData = data as LoginInput;
        await performSignIn(
          loginData.email,
          loginData.password,
          "Выполняется вход...",
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      showError(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    setShowPassword(false);
    form.reset();
    router.push(isLogin ? "/auth/register" : "/auth/login");
  };

  const fields: FieldConfig<FormInput>[] = isLogin
    ? [
        {
          name: "email",
          placeholder: "your@email.com",
          icon: <Mail className="text-muted-foreground w-5 h-5" />,
          type: "email",
          autoComplete: "email",
        },
        {
          name: "password",
          placeholder: "••••••",
          icon: <Lock className="text-muted-foreground w-5 h-5" />,
          type: showPassword ? "text" : "password",
          showPasswordToggle: true,
        },
      ]
    : [
        {
          name: "name",
          placeholder: "John Doe",
          icon: <User className="text-muted-foreground w-5 h-5" />,
        },
        {
          name: "email",
          placeholder: "your@email.com",
          icon: <Mail className="text-muted-foreground w-5 h-5" />,
          type: "email",
          autoComplete: "email",
        },
        {
          name: "password",
          placeholder: "••••••",
          icon: <Lock className="text-muted-foreground w-5 h-5" />,
          type: showPassword ? "text" : "password",
          showPasswordToggle: true,
        },
      ];

  const title = isLogin ? "Вход" : "Регистрация";
  const submitText = isLogin ? "Войти" : "Зарегистрироваться";
  const toggleLink = isLogin ? (
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
  ) : (
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
  );

  return {
    title,
    fields,
    control: form.control,
    errors: form.formState.errors,
    touched,
    onSubmit: form.handleSubmit(onSubmit),
    submitText,
    loading,
    error,
    toggleLink,
    onEnter: handleEnter,
    onBlur: handleBlur,
    passwordVisible: showPassword,
    onTogglePassword: toggleShowPassword,
  };
}
