"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function AddModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Сохранить",
  isSubmitting = false,
}: AddModalProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    if (window.history.state?.modal) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      if (!window.history.state?.modal) {
        window.history.pushState({ modal: true }, "", window.location.pathname);
      }
    } else {
      if (window.history.state?.modal) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isOpen && !event.state?.modal) {
        handleClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      handleClose();
    }
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]");
      if (link) {
        const href = link.getAttribute("href");
        if (href) {
          const currentPath = window.location.pathname;
          if (href === currentPath || href === "") {
            handleClose();
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen, handleClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pb-14 lg:pb-0"
      onClick={handleOverlayClick}
    >
      <Card className="max-h-[80vh] w-full max-w-lg flex flex-col mb-4">
        <CardHeader className="bg-muted/50 p-3">
          <CardTitle className="text-xl flex justify-center">{title}</CardTitle>
        </CardHeader>
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col flex-1 min-h-0"
        >
          <CardContent className="flex-1 overflow-y-auto space-y-4 py-2">
            {children}
          </CardContent>
          <CardFooter className="flex justify-end py-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохранение..." : submitLabel}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
