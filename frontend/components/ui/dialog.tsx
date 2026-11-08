"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const close = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="fixed inset-0 bg-slate-900/50"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="dialog-title"
        className={cn(
          "relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-xl bg-white shadow-xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 pr-2">
            <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
