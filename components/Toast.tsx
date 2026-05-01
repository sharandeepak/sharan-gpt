"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ToastInput {
  title: string;
  description?: string;
  tone?: "info" | "success" | "danger";
  ttl?: number;
}

interface ToastRecord extends ToastInput {
  id: string;
  ttl: number;
  tone: "info" | "success" | "danger";
}

type ShowToast = (input: ToastInput) => void;

const ToastContext = React.createContext<ShowToast | null>(null);

export function useToast(): ShowToast {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    // Defensive no-op: never crash if a consumer renders outside the provider.
    return () => {};
  }
  return ctx;
}

interface ToastItemProps {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    const t = setTimeout(() => onDismiss(toast.id), toast.ttl);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [toast.id, toast.ttl, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex max-w-[320px] items-start gap-2 rounded-md border border-border bg-panel-soft px-3 py-2 text-[13px] text-fg",
        "transition-[opacity,transform] duration-[180ms] ease-[var(--ease-out-quart)]",
        entered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      )}
    >
      {toast.tone !== "info" ? (
        <span
          aria-hidden="true"
          className={cn(
            "mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full",
            toast.tone === "success" ? "bg-success" : "bg-danger"
          )}
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="font-medium leading-snug text-fg">{toast.title}</div>
        {toast.description ? (
          <div className="mt-0.5 text-[12.5px] leading-snug text-fg-muted">
            {toast.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = React.useCallback<ShowToast>((input) => {
    const id = `t_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const record: ToastRecord = {
      id,
      title: input.title,
      description: input.description,
      tone: input.tone ?? "info",
      ttl: input.ttl ?? 1800,
    };
    setToasts((prev) => [...prev, record]);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {mounted
        ? createPortal(
            <div
              aria-live="polite"
              className={cn(
                "pointer-events-none fixed z-[60] flex flex-col gap-2",
                // bottom-right on desktop, top-right on mobile
                "bottom-auto right-3 top-3 sm:bottom-3 sm:right-3 sm:top-auto"
              )}
            >
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}
