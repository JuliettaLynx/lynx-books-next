import { toast } from "sonner";
import {
  CircleCheckBig,
  CircleX,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import React from "react";

const ICON_SIZE = "w-5 h-5";

const createIcon = (Icon: any, colorClass: string) => {
  return React.createElement(Icon, { className: `${ICON_SIZE} ${colorClass}` });
};

export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    icon: createIcon(CircleCheckBig, "text-green-500"),
    duration: 1000,
  });
};

export const showError = (message: string, description?: string) => {
  toast.error(message, {
    icon: createIcon(CircleX, "text-red-500"),
    duration: 5000,
  });
};

// === Пока не используется ===
export const showWarning = (message: string, description?: string) => {
  toast.warning(message, {
    icon: createIcon(AlertCircle, "text-yellow-500"),
    duration: 4000,
  });
};

export const showInfo = (message: string, description?: string) => {
  toast.info(message, {
    icon: createIcon(Info, "text-blue-500"),
    duration: 3000,
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    icon: createIcon(Loader2, "animate-spin"),
  });
};
