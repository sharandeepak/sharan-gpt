"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { THEMES, type ThemeId } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ThemeSwitcherProps {
  current: ThemeId;
  onChange: (theme: ThemeId) => void;
}

export function ThemeSwitcher({ current, onChange }: ThemeSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const active = THEMES.find((t) => t.id === current) ?? THEMES[0]!;

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const node = wrapRef.current;
      if (!node) return;
      if (node.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-label="Change theme"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8"
      >
        <Palette size={14} strokeWidth={1.6} />
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label="Theme selector"
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-panel p-2"
          )}
        >
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((t) => {
              const isActive = t.id === current;
              return (
                <button
                  key={t.id}
                  type="button"
                  title={t.name}
                  aria-label={t.name}
                  aria-pressed={isActive}
                  onClick={() => {
                    onChange(t.id);
                  }}
                  className={cn(
                    "h-4 w-4 rounded-full transition-[outline-color,transform] duration-[120ms] ease-[var(--ease-out-quart)]",
                    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
                    isActive
                      ? "outline outline-2 outline-accent outline-offset-2"
                      : "outline-none"
                  )}
                  style={{
                    background: t.bg,
                    boxShadow: `inset 0 0 0 1px ${t.accent}`,
                  }}
                />
              );
            })}
          </div>
          <div className="mt-2 border-t border-border px-1 py-1.5 font-mono text-[11px] leading-snug text-fg-subtle">
            <div className="text-fg-muted">{active.name}</div>
            <div className="mt-0.5">{active.description}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ThemeSwitcher;
