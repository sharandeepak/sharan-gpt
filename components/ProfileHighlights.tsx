import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProfileHighlightsProps {
  name: string;
  role: string;
  location: string;
  tagline: string;
  stack: string[];
  strengths: string[];
  className?: string;
}

export function ProfileHighlights({
  name,
  role,
  location,
  tagline,
  stack,
  strengths,
  className,
}: ProfileHighlightsProps) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        <h1
          className="text-[30px] font-semibold leading-[1.1] text-fg"
          style={{ letterSpacing: "-0.015em" }}
        >
          {name}
        </h1>
        <p className="text-[15px] leading-[1.2] text-fg-muted">
          <span>{role}</span>
          <span aria-hidden="true" className="mx-1.5 text-fg-subtle">
            ·
          </span>
          <span>{location}</span>
        </p>
      </div>

      {tagline ? (
        <p
          className="max-w-[60ch] text-[15.5px] leading-[1.55] text-fg"
        >
          {tagline}
        </p>
      ) : null}

      {stack.length ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Core stack">
          {stack.map((item) => (
            <li key={item}>
              <span className="inline-flex items-center rounded-full border border-border bg-panel-soft px-2.5 py-1 font-mono text-[12px] text-fg-muted">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {strengths.length ? (
        <p className="text-[13px] text-fg-muted" aria-label="Strengths">
          {strengths.map((s, i) => (
            <React.Fragment key={s}>
              <span>{s}</span>
              {i < strengths.length - 1 ? (
                <span aria-hidden="true" className="mx-1.5 text-fg-subtle">
                  ·
                </span>
              ) : null}
            </React.Fragment>
          ))}
        </p>
      ) : null}
    </header>
  );
}

export default ProfileHighlights;
