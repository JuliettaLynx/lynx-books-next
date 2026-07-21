"use client";

import { useState, useEffect, useRef, ChangeEvent, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Target,
  Palette,
  Loader2,
  AlertTriangle,
  Check,
  X,
  Camera,
} from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import { PALETTES, PALETTE_NAMES } from "@/lib/palettes";
import imageCompression from "browser-image-compression";

// === Schemas ===
const ProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Имя должно содержать минимум 3 символа")
    .max(30, "Имя должно содержать максимум 30 символов"),
  email: z.string().trim().toLowerCase().email("Некорректный email-адрес"),
});
type ProfileInput = z.infer<typeof ProfileSchema>;

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
type PasswordInput = z.infer<typeof PasswordSchema>;

const AppSettingsSchema = z.object({
  dailyGoal: z.number().int().min(0).max(9999),
  paletteIndex: z
    .number()
    .int()
    .min(0)
    .max(PALETTES.length - 1)
    .optional(),
});
type AppSettingsInput = z.infer<typeof AppSettingsSchema>;

// ============================================================
// 1. Внутренний компонент со всей логикой (переименован)
// ============================================================
function SettingsModalContent() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // === Состояния ===
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "app">("profile");
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);

  // Аватар
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = searchParams.get("settings") === "open";

  // Закрытие модалки
  const closeModal = () => {
    if (session?.user) {
      const user = session.user as any;
      profileForm.reset({ name: user.name || "", email: user.email || "" });
      appForm.reset({
        dailyGoal: user.dailyGoal || 30,
        paletteIndex: user.paletteIndex ?? 0,
      });
      setAvatarUrl(user.avatar || null);
      setAvatarPreview(user.avatar || null);
    } else {
      profileForm.reset({ name: "", email: "" });
      appForm.reset({ dailyGoal: 30, paletteIndex: 0 });
      setAvatarUrl(null);
      setAvatarPreview(null);
    }

    passwordForm.reset();
    setDeleteConfirm(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setActiveTab("profile");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("settings");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, router, searchParams]);

  // === Формы ===
  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const appForm = useForm<AppSettingsInput>({
    resolver: zodResolver(AppSettingsSchema),
    defaultValues: {
      dailyGoal: ((session as any)?.user?.dailyGoal as number) || 30,
      paletteIndex: ((session as any)?.user?.paletteIndex as number) ?? 0,
    },
    mode: "onChange",
  });

  const watchDailyGoal = appForm.watch("dailyGoal");
  const watchPaletteIndex = appForm.watch("paletteIndex");

  // Функция сохранения
  const saveAppSettings = async () => {
    const data = appForm.getValues();
    setAppLoading(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyGoal: data.dailyGoal,
          paletteIndex: data.paletteIndex,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        showError(result.error || "Ошибка обновления настроек");
        return;
      }

      // Обновляем локальное состояние
      if (result.user.paletteIndex !== undefined) {
        setSelectedPaletteIndex(result.user.paletteIndex);
      }

      await updateSession();
      router.refresh();
      showSuccess("Настройки сохранены");

      // Сбрасываем dirty состояние
      appForm.reset({
        dailyGoal: data.dailyGoal,
        paletteIndex: data.paletteIndex,
      });
    } catch {
      showError("Ошибка сети");
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (appForm.formState.isDirty) {
        saveAppSettings();
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [watchDailyGoal, watchPaletteIndex]);

  // Загрузка данных пользователя
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setAvatarUrl(user.avatar || null);
      setAvatarPreview(user.avatar || null);

      const idx = user.paletteIndex ?? 0;
      setSelectedPaletteIndex(idx);
      profileForm.reset({ name: user.name || "", email: user.email || "" });
      appForm.reset({ dailyGoal: user.dailyGoal || 30, paletteIndex: idx });
    }
  }, [session, profileForm, appForm]);

  // === Проверка изменений ===
  const isProfileDirty =
    profileForm.formState.isDirty || avatarPreview !== avatarUrl;
  const isPasswordDirty = passwordForm.formState.isDirty;
  const isAppDirty = appForm.formState.isDirty;

  // === Аватар ===
  const saveAvatar = async (file: File | null) => {
    setAvatarLoading(true);
    try {
      let avatarPath = null;

      if (file) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 300,
          useWebWorker: true,
          fileType: "image/webp",
        };
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append("avatar", compressedFile);

        const res = await fetch("/api/settings/avatar", {
          method: "POST",
          body: formData,
        });
        // Сначала проверяем статус
        if (!res.ok) {
          // Пытаемся получить текст ошибки, если есть
          const errorText = await res.text();
          console.error("Server error:", res.status, errorText);
          // Пытаемся распарсить как JSON, но если не получится, показываем текст
          let errorMsg = "Ошибка загрузки аватара";
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) errorMsg = errorJson.error;
          } catch {
            if (errorText) errorMsg = errorText;
          }
          showError(errorMsg);
          return false;
        }

        const result = await res.json();
        avatarPath = result.avatar;
      } else {
        // Удаление аватара
        const res = await fetch("/api/settings/avatar", { method: "DELETE" });
        const result = await res.json();
        if (!res.ok) {
          showError(result.error || "Ошибка удаления аватара");
          return false;
        }
      }

      await updateSession();
      router.refresh();
      setAvatarUrl(avatarPath);
      setAvatarPreview(avatarPath);
      showSuccess(file ? "Аватар обновлён" : "Аватар удалён");
      return true;
    } catch (error) {
      console.error("Avatar error:", error);
      showError(
        "Ошибка обработки изображения: " +
          (error instanceof Error ? error.message : ""),
      );
      return false;
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Выберите файл изображения");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("Файл слишком большой. Максимум 5 МБ.");
      return;
    }
    await saveAvatar(file);
    // Очищаем input, чтобы можно было загрузить тот же файл повторно
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAvatar = async () => {
    await saveAvatar(null);
  };

  // === Обновление профиля ===
  const handleProfileSubmit = async (data: ProfileInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email }),
      });

      const result = await res.json();
      if (!res.ok) {
        showError(result.error || "Ошибка обновления профиля");
        return;
      }

      await updateSession();
      router.refresh();
      showSuccess("Профиль обновлён");
      profileForm.reset(data);
    } catch {
      showError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  // === Смена пароля ===
  const handlePasswordSubmit = async (data: PasswordInput) => {
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.newPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        showError(result.error || "Ошибка смены пароля");
        return;
      }

      showSuccess("Пароль изменён");
      passwordForm.reset();
    } catch {
      showError("Ошибка сети");
    } finally {
      setPasswordLoading(false);
    }
  };

  // === Удаление аккаунта ===
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return;

    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить аккаунт?\n\nЭто действие необратимо. Все ваши данные, включая книги и сессии чтения, будут удалены безвозвратно.",
    );

    if (!confirmed) return;

    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmDelete: true }),
      });

      const result = await res.json();
      if (!res.ok) {
        showError(result.error || "Ошибка удаления аккаунта");
        return;
      }

      showSuccess("Аккаунт удалён");
      signOut({ redirect: true, callbackUrl: "/auth" });
    } catch {
      showError("Ошибка сети");
    }
  };

  // === Выход ===
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
  };

  // Если модалка закрыта — не рендерим ничего
  if (!isOpen) return null;

  // === Рендер иконки аватара ===
  const renderAvatar = () => {
    if (avatarPreview) {
      return (
        <img
          src={avatarPreview}
          alt="Аватар"
          className="w-24 h-24 rounded-full object-cover border-2 border-border"
        />
      );
    }
    return (
      <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center border-2 border-border">
        <User className="w-12 h-12 text-accent" />
      </div>
    );
  };

  // === Рендер палитры ===
  const renderPalette = (index: number) => {
    const colors = PALETTES[index];
    const isSelected = selectedPaletteIndex === index;
    const totalColors = Math.min(colors.length, 8);
    const circleSize = 30;
    const step = 20;
    const totalWidth = (totalColors - 1) * step + circleSize;

    return (
      <button
        type="button"
        onClick={() => {
          setSelectedPaletteIndex(index);
          appForm.setValue("paletteIndex", index, { shouldDirty: true });
        }}
        className={`relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
          isSelected
            ? "ring-2 ring-accent ring-offset-2 ring-offset-bg-secondary"
            : "hover:ring-1 hover:ring-border"
        }`}
      >
        <div
          className="relative h-8 overflow-visible"
          style={{ width: totalWidth }}
        >
          {colors.slice(0, 8).map((color, i) => {
            const left = i * step;
            return (
              <div
                key={i}
                className="absolute rounded-full border border-white/20 shadow-sm"
                style={{
                  backgroundColor: color,
                  width: circleSize,
                  height: circleSize,
                  top: "50%",
                  left: left,
                  transform: "translateY(-50%)",
                  zIndex: 8 - i,
                }}
              />
            );
          })}
        </div>

        <span className="text-xs text-text/70">{PALETTE_NAMES[index]}</span>

        {isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-bg-primary" />
          </div>
        )}
      </button>
    );
  };

  // === Инпут с иконкой ===
  const renderField = (
    label: string,
    icon: React.ReactNode,
    inputProps: React.InputHTMLAttributes<HTMLInputElement>,
    error?: string,
  ) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50">
          {icon}
        </div>

        <input
          {...inputProps}
          className={`w-full pl-10 pr-4 py-2.5 bg-field border ${
            error ? "border-red-500" : "border-border"
          } rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50`}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );

  // Возвращаем разметку модалки
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="fixed inset-0 z-50 flex items-start justify-end">
        <button
          onClick={closeModal}
          className="fixed top-4 right-6 z-50 p-2 rounded-lg bg-bg-secondary border border-border hover:bg-border/50 transition-colors"
        >
          <X className="w-5 h-5 text-text" />
        </button>
        <div className="w-full max-w-lg h-screen bg-bg-primary overflow-y-auto border-l border-border shadow-2xl">
          <div className="p-4 lg:p-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6">
              Настройки
            </h1>
            <div className="mb-6">
              <div className="flex bg-bg-secondary rounded-lg p-1 border border-border">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-accent/20 text-accent"
                      : "text-text/70 hover:text-text"
                  }`}
                >
                  Профиль
                </button>
                <button
                  onClick={() => setActiveTab("app")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "app"
                      ? "bg-accent/20 text-accent"
                      : "text-text/70 hover:text-text"
                  }`}
                >
                  Приложение
                </button>
              </div>
            </div>

            {/* === Секция: Профиль === */}
            <div className={`${activeTab === "profile" ? "block" : "hidden"}`}>
              <div className="bg-bg-secondary rounded-xl border border-border p-4 lg:p-6 space-y-6">
                <div className="flex gap-3 justify-between">
                  <div className="flex flex-col items-center gap-3 mt-12">
                    <div className="relative group">
                      {renderAvatar()}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarLoading}
                        className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:cursor-not-allowed"
                      >
                        {avatarLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors z-10"
                          title="Удалить аватар"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                    className="space-y-4"
                  >
                    <h2 className="text-lg font-semibold text-white">
                      Личные данные
                    </h2>
                    {renderField(
                      "",
                      <User className="w-5 h-5" />,
                      {
                        ...profileForm.register("name"),
                        type: "text",
                        placeholder: "Ваше имя",
                      },
                      profileForm.formState.errors.name?.message,
                    )}
                    {renderField(
                      "",
                      <Mail className="w-5 h-5" />,
                      {
                        ...profileForm.register("email"),
                        type: "email",
                        placeholder: "your@email.com",
                      },
                      profileForm.formState.errors.email?.message,
                    )}
                    <button
                      type="submit"
                      disabled={!isProfileDirty || loading}
                      className="w-full py-2.5 bg-accent hover:bg-accent/80 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Сохранить
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="border-t border-border" />

                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white">Пароль</h2>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text">
                      Текущий пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50" />
                      <input
                        {...passwordForm.register("currentPassword")}
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="* * * * * *"
                        className="w-full pl-10 pr-10 py-2.5 bg-field border border-border rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-red-400 text-xs">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text">
                      Новый пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50" />
                      <input
                        {...passwordForm.register("newPassword")}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="* * * * * *"
                        className="w-full pl-10 pr-10 py-2.5 bg-field border border-border rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-400 text-xs">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text">
                      Подтвердите пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50" />
                      <input
                        {...passwordForm.register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="* * * * * *"
                        className="w-full pl-10 pr-10 py-2.5 bg-field border border-border rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-xs">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isPasswordDirty || passwordLoading}
                    className="w-full py-2.5 bg-accent hover:bg-accent/80 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Изменение...
                      </>
                    ) : (
                      "Изменить пароль"
                    )}
                  </button>
                </form>

                <div className="border-t border-border" />

                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-field hover:bg-field/80 text-text border border-border rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Выйти из аккаунта
                  </button>

                  <div className="space-y-2">
                    {!deleteConfirm ? (
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Удалить аккаунт
                      </button>
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-red-400 font-medium text-sm">
                              Подтвердите удаление
                            </p>
                            <p className="text-red-400/70 text-xs mt-1">
                              Это действие необратимо. Все ваши данные будут
                              удалены безвозвратно.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDeleteAccount}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Безвозвратно удалить
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(false)}
                            className="px-4 py-2 bg-field hover:bg-field/80 text-text border border-border rounded-lg transition-colors text-sm"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Секция Приложение */}
            <div
              className={`${activeTab === "app" ? "block" : "hidden"} mt-4 lg:mt-6`}
            >
              <div className="bg-bg-secondary rounded-xl border border-border p-4 lg:p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">
                  Настройки приложения
                </h2>

                <form className="space-y-6">
                  {/* Цель страниц в день */}
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <Target className="w-5 h-5 text-accent" />
                      <label className="text-sm font-medium text-text">
                        Цель страниц в день
                      </label>
                    </div>
                    <input
                      {...appForm.register("dailyGoal", {
                        valueAsNumber: true,
                        onChange: () =>
                          appForm.setValue(
                            "dailyGoal",
                            appForm.getValues("dailyGoal"),
                            { shouldDirty: true },
                          ),
                      })}
                      type="number"
                      min="0"
                      max="9999"
                      placeholder="30"
                      className="w-full px-4 py-2.5 bg-field border border-border rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />

                    {appForm.formState.errors.dailyGoal && (
                      <p className="text-red-400 text-xs">Введите число</p>
                    )}
                    <p className="text-xs text-text/50">
                      Установите ежедневную цель по страницам для мотивации
                    </p>
                  </div>

                  <div className="border-t border-border" />

                  {/* Цветовая палитра */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-accent" />
                      <label className="text-sm font-medium text-text">
                        Цветовая палитра для трекера чтения
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {PALETTES.map((_, index) => (
                        <div key={index}>{renderPalette(index)}</div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// 2. Экспортируемый компонент-обёртка с Suspense
// ============================================================
export function SettingsModal() {
  return (
    <Suspense fallback={null}>
      <SettingsModalContent />
    </Suspense>
  );
}
