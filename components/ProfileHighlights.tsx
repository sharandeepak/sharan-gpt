import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProfileHighlightsProps {
  name: string;
  role: string;
  location: string;
  className?: string;
}

export function ProfileHighlights({
  name,
  role,
  location,
  className,
}: ProfileHighlightsProps) {
  return (
    <header className={cn("flex flex-col gap-1.5", className)}>
      <h1
        className="text-[30px] font-semibold leading-[1.1] text-fg"
        style={{ letterSpacing: "-0.015em" }}
      >
        {name}
      </h1>
      <p className="text-[15px] leading-[1.2] text-fg-muted">
        <span>{role}</span>
        <span aria-hidden="true" className="mx-1.5 text-fg-subtle">·</span>
        <span>{location}</span>
      </p>
    </header>
  );
}

export default ProfileHighlights;
