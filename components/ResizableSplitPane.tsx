"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  storageKey?: string;
  minLeft?: number;
  maxLeft?: number;
  defaultLeft?: number;
  className?: string;
}

const MOBILE_BREAKPOINT = 860;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function ResizableSplitPane({
  left,
  right,
  storageKey = "resume.split.left",
  minLeft = 0.32,
  maxLeft = 0.68,
  defaultLeft = 0.5,
  className,
}: ResizableSplitPaneProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = React.useState<number>(defaultLeft);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [hydrated, setHydrated] = React.useState(false);
  const draggingRef = React.useRef(false);

  // Hydrate from localStorage on mount (no SSR mismatch)
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseFloat(stored);
        if (!Number.isNaN(parsed)) {
          setRatio(clamp(parsed, minLeft, maxLeft));
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey, minLeft, maxLeft]);

  // Track viewport for mobile
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const persist = React.useCallback(
    (value: number) => {
      try {
        window.localStorage.setItem(storageKey, String(value));
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const onPointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const next = clamp(x / rect.width, minLeft, maxLeft);
      setRatio(next);
    },
    [minLeft, maxLeft]
  );

  const stopDrag = React.useCallback(
    (e?: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDrag);
      // persist current ratio
      setRatio((current) => {
        persist(current);
        return current;
      });
      void e;
    },
    [onPointerMove, persist]
  );

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDrag);
  };

  const handleDoubleClick = () => {
    setRatio(0.5);
    persist(0.5);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 0.02;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setRatio((r) => {
        const next = clamp(r - step, minLeft, maxLeft);
        persist(next);
        return next;
      });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setRatio((r) => {
        const next = clamp(r + step, minLeft, maxLeft);
        persist(next);
        return next;
      });
    } else if (e.key === "Home") {
      e.preventDefault();
      setRatio(0.5);
      persist(0.5);
    }
  };

  // Stacked / mobile layout
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className={cn("flex h-full w-full flex-col", className)}
      >
        <div className="w-full">{left}</div>
        <div className="w-full">{right}</div>
      </div>
    );
  }

  const leftBasis = `${(ratio * 100).toFixed(4)}%`;
  const rightBasis = `${((1 - ratio) * 100).toFixed(4)}%`;

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-full w-full flex-row", className)}
    >
      <div
        className="min-w-0 overflow-hidden"
        style={{
          flexBasis: hydrated ? leftBasis : `${defaultLeft * 100}%`,
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        {left}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={Math.round(minLeft * 100)}
        aria-valuemax={Math.round(maxLeft * 100)}
        aria-label="Resize panels"
        tabIndex={0}
        onPointerDown={startDrag}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative flex w-2 shrink-0 cursor-col-resize items-stretch justify-center select-none",
          "focus-visible:outline-none"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "block h-full w-px bg-border transition-colors duration-[120ms] ease-[var(--ease-out-quart)]",
            "group-hover:bg-border-strong group-focus-visible:bg-accent"
          )}
        />
      </div>

      <div
        className="min-w-0 overflow-hidden"
        style={{
          flexBasis: hydrated ? rightBasis : `${(1 - defaultLeft) * 100}%`,
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        {right}
      </div>
    </div>
  );
}

export default ResizableSplitPane;
