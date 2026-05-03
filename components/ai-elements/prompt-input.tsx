"use client";

import * as React from "react";
import { ArrowUp, Square, RefreshCw } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PromptInputMessage {
  text: string;
}

export interface PromptInputProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: (message: PromptInputMessage) => void;
}

interface PromptInputContextValue {
  registerTextarea: (el: HTMLTextAreaElement | null) => void;
  submit: () => void;
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(
  null
);

export function PromptInput({
  onSubmit,
  className,
  children,
  ...props
}: PromptInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const submit = React.useCallback(() => {
    const ta = textareaRef.current;
    const text = (ta?.value ?? "").trim();
    if (!text) return;
    onSubmit({ text });
  }, [onSubmit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const value = React.useMemo<PromptInputContextValue>(
    () => ({
      registerTextarea: (el) => {
        textareaRef.current = el;
      },
      submit,
    }),
    [submit]
  );

  return (
    <PromptInputContext.Provider value={value}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "group relative flex w-full min-w-0 items-end gap-2 rounded-lg border border-border bg-panel px-3 py-2 transition-colors duration-[120ms] ease-[var(--ease-out-quart)] focus-within:border-border-strong",
          className
        )}
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
}

export interface PromptInputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(function PromptInputTextarea(
  { className, onKeyDown, onInput, style, rows = 1, placeholder, ...props },
  ref
) {
  const ctx = React.useContext(PromptInputContext);
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      ctx?.registerTextarea(node);
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          node;
    },
    [ctx, ref]
  );

  const autosize = React.useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    // JS fallback for browsers without field-sizing: content
    el.style.height = "auto";
    const max = 160;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, []);

  React.useEffect(() => {
    autosize();
  }, [autosize, props.value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      ctx?.submit();
    }
  };

  return (
    <textarea
      ref={setRef}
      rows={rows}
      placeholder={placeholder ?? "Ask a question…"}
      onKeyDown={handleKeyDown}
      onInput={(e) => {
        autosize();
        onInput?.(e);
      }}
      style={
        {
          // modern browsers honor field-sizing; JS keeps fallback in sync
          fieldSizing: "content",
          minHeight: 42,
          maxHeight: 160,
          ...style,
        } as React.CSSProperties & { fieldSizing: "content" }
      }
      className={cn(
        "block min-w-0 w-full flex-1 resize-none bg-transparent px-1 py-1 text-[13px] leading-[1.45] text-fg placeholder:text-[clamp(12px,1em,13px)] placeholder:leading-[1.4] placeholder:text-fg-subtle focus:outline-none sm:text-[14px]",
        "scrollbar-clean",
        className
      )}
      {...props}
    />
  );
});

PromptInputTextarea.displayName = "PromptInputTextarea";

export type PromptInputStatus =
  | "ready"
  | "streaming"
  | "submitted"
  | "error"
  | undefined;

export interface PromptInputSubmitProps extends ButtonProps {
  status?: PromptInputStatus;
}

export const PromptInputSubmit = React.forwardRef<
  HTMLButtonElement,
  PromptInputSubmitProps
>(function PromptInputSubmit(
  { status = "ready", className, disabled, children, ...props },
  ref
) {
  const Icon =
    status === "streaming"
      ? Square
      : status === "error"
        ? RefreshCw
        : ArrowUp;

  const isDisabled = disabled || status === "streaming";

  return (
    <Button
      ref={ref}
      type="submit"
      variant="primary"
      size="icon"
      aria-label={
        status === "streaming"
          ? "Stop"
          : status === "error"
            ? "Retry"
            : "Send"
      }
      disabled={isDisabled}
      className={cn("h-8 w-8 shrink-0 rounded-md", className)}
      {...props}
    >
      {children ?? <Icon size={14} strokeWidth={1.6} />}
    </Button>
  );
});

PromptInputSubmit.displayName = "PromptInputSubmit";
