"use client";

import AuthLayout from "@/shared/layout/AuthLayout";
import { AuthForm } from "@/features/auth/ui/AuthForm";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";

export default function RegisterPage() {
  const authProps = useAuthForm("register");
  return (
    <AuthLayout>
      <AuthForm {...authProps} />
    </AuthLayout>
  );
}