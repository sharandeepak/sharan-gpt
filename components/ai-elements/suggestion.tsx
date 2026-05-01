"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SuggestionsProps = React.HTMLAttributes<HTMLDivElement>;

export function Suggestions({
  className,
  children,
  ...props
}: SuggestionsProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SuggestionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  suggestion: string;
  onClick?: (suggestion: string) => void;
}

export const Suggestion = React.forwardRef<
  HTMLButtonElement,
  SuggestionProps
>(function Suggestion(
  { suggestion, onClick, className, children, type, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      onClick={() => onClick?.(suggestion)}
      title={suggestion}
      className={cn(
        "inline-flex max-w-[56ch] items-center truncate rounded-full border border-border bg-panel-soft px-3 py-1.5 text-[13px] text-fg-muted transition-[colors,background-color,border-color] duration-[120ms] ease-[var(--ease-out-quart)]",
        "hover:border-border-strong hover:text-fg",
        "focus-visible:border-accent focus-visible:text-fg",
        "active:border-accent active:text-fg",
        className
      )}
      {...rest}
    >
      <span className="truncate">{children ?? suggestion}</span>
    </button>
  );
});

Suggestion.displayName = "Suggestion";
