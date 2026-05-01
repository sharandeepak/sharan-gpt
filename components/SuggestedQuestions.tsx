"use client";

import * as React from "react";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { cn } from "@/lib/utils";

export interface SuggestedItem {
  id: string;
  question: string;
  category: string;
  priority: number;
}

export interface SuggestedQuestionsProps {
  items: SuggestedItem[];
  onSelect: (item: SuggestedItem) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "row" | "grid";
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

const SKELETON_KEYS = ["a", "b", "c", "d"] as const;

export function SuggestedQuestions({
  items,
  onSelect,
  loading,
  disabled,
  className,
  variant = "row",
}: SuggestedQuestionsProps) {
  const containerClass =
    variant === "grid"
      ? "grid grid-cols-1 gap-2 sm:grid-cols-2"
      : "flex flex-wrap items-center gap-2";

  if (loading) {
    return (
      <div className={cn(containerClass, className)} aria-busy="true">
        {SKELETON_KEYS.map((k) => (
          <div
            key={k}
            className="h-7 w-44 animate-pulse rounded-full bg-panel-soft"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  if (variant === "grid") {
    return (
      <div className={cn(containerClass, className)}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item)}
            title={item.question}
            className={cn(
              "group/sg inline-flex items-center justify-between gap-2 rounded-md border border-border bg-panel px-3 py-2 text-left text-[13.5px] text-fg-muted",
              "transition-[colors,border-color,background-color] duration-[120ms] ease-[var(--ease-out-quart)]",
              "hover:border-border-strong hover:bg-panel-soft hover:text-fg",
              "focus-visible:border-accent focus-visible:text-fg",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span className="truncate">{truncate(item.question, 56)}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <Suggestions className={cn(className)}>
      {items.map((item) => (
        <Suggestion
          key={item.id}
          suggestion={item.question}
          disabled={disabled}
          onClick={() => onSelect(item)}
          className="truncate max-w-[36ch]"
        >
          {truncate(item.question, 56)}
        </Suggestion>
      ))}
    </Suggestions>
  );
}

export default SuggestedQuestions;
