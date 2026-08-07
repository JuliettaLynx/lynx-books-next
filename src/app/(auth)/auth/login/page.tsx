"use client";

import AuthLayout from "@/shared/layout/AuthLayout";
import { AuthForm } from "@/features/auth/ui/AuthForm";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";

export default function LoginPage() {
  const authProps = useAuthForm("login");
  return (
    <AuthLayout>
      <AuthForm {...authProps} />
    </AuthLayout>
  );
}
