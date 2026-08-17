"use client";

import * as React from "react";
import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
}

export function ConfirmModal({
  trigger,
  title,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "default",
  onConfirm,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false);
  const isBackCalledRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      if (isBackCalledRef.current) {
        isBackCalledRef.current = false;
        return;
      }
      if (open) {
        setOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      window.history.pushState({ modal: true }, "", window.location.href);
    } else {
      if (window.history.state?.modal) {
        isBackCalledRef.current = true;
        window.history.back();
      }
    }
    setOpen(newOpen);
  };

  const handleConfirm = () => {
    handleOpenChange(false);
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={(props) =>
          React.cloneElement(trigger as React.ReactElement, props)
        }
      />
      <AlertDialogContent onBackdropClick={() => handleOpenChange(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
