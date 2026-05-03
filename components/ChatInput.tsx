"use client";

import * as React from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

export interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (text: string) => void;
  status: "ready" | "streaming" | "submitted" | "error";
  disabled?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  isPrimed?: boolean;
}

const DEFAULT_PLACEHOLDER =
  "Ask about scaling, mobile, AI workflows, impact at SurveySparrow…";

function useModKeyLabel(): string {
  const [label, setLabel] = React.useState<string>("⌘");
  React.useEffect(() => {
    try {
      const nav = navigator as Navigator & {
        userAgentData?: { platform?: string };
      };
      const fromUaData = nav.userAgentData?.platform ?? "";
      const fromUa = nav.userAgent ?? "";
      const isMac =
        fromUaData.toLowerCase().includes("mac") ||
        /macintosh|mac os x/i.test(fromUa);
      if (!isMac) setLabel("Ctrl");
    } catch {
      // keep default
    }
  }, []);
  return label;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  status,
  disabled,
  placeholder,
  inputRef,
  containerRef,
  isPrimed = false,
}: ChatInputProps) {
  const modKey = useModKeyLabel();

  const handleSubmit = ({ text }: { text: string }) => {
    const trimmed = text.trim();
    if (!trimmed || disabled || status === "streaming") return;
    onSubmit(trimmed);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-1.5 rounded-xl transition-[box-shadow,transform] duration-500 ease-[var(--ease-out-quart)]",
        isPrimed &&
          "translate-y-[-1px] shadow-[0_0_0_1px_var(--color-accent),0_0_0_6px_color-mix(in_oklch,var(--color-accent)_16%,transparent)]"
      )}
    >
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? DEFAULT_PLACEHOLDER}
          disabled={disabled || status === "streaming"}
          aria-label="Ask the resume assistant"
        />
        <PromptInputSubmit status={status} disabled={disabled} />
      </PromptInput>

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1 px-1 font-mono text-[12px] text-fg-subtle"
        )}
      >
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded-md border border-border bg-panel-soft px-1.5 py-0.5 text-[11px] leading-none text-fg-muted">
            {modKey}K
          </kbd>
          <span>focus</span>
        </span>
        <span aria-hidden="true" className="text-fg-subtle">
          ·
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded-md border border-border bg-panel-soft px-1.5 py-0.5 text-[11px] leading-none text-fg-muted">
            {modKey}D
          </kbd>
          <span>download resume</span>
        </span>
      </div>
    </div>
  );
}

export default ChatInput;
