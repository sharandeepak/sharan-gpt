"use client";

import * as React from "react";
import { ResumePanel } from "@/components/ResumePanel";
import { ResizableSplitPane } from "@/components/ResizableSplitPane";
import { ChatPanel } from "@/components/ChatPanel";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from "@/lib/themes";
import { getOrCreateSessionId } from "@/lib/session-client";
import { type Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface ResumeWebsiteLayoutProps {
  profile: Profile;
}

const RESUME_HREF = "/resume.pdf";
const RESUME_FILENAME = "Sharan Deepak — Resume.pdf";

function modKeyLabel(): string {
  if (typeof navigator === "undefined") return "⌘";
  try {
    const ua = navigator.userAgent ?? "";
    const nav = navigator as Navigator & {
      userAgentData?: { platform?: string };
    };
    const platform = nav.userAgentData?.platform ?? "";
    if (/Mac|iPhone|iPad|iPod/i.test(`${ua} ${platform}`)) return "⌘";
  } catch {
    // ignore
  }
  return "Ctrl";
}

function deriveDisplayRole(profile: Profile): string {
  // Prefer the most recent experience role; fall back to a recruiter-friendly default.
  const current = profile.experience.find(
    (e) => e.endDate.toLowerCase() === "present"
  );
  if (current) return `${current.role} · ${current.company}`;
  const first = profile.experience[0];
  if (first) return `${first.role} · ${first.company}`;
  return "Software Engineer";
}

export function ResumeWebsiteLayout({ profile }: ResumeWebsiteLayoutProps) {
  const [theme, setTheme] = React.useState<ThemeId>(DEFAULT_THEME);
  const [sessionId, setSessionId] = React.useState<string>("");
  const [modKey, setModKey] = React.useState<string>("⌘");
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const downloadAnchorRef = React.useRef<HTMLAnchorElement | null>(null);

  // Hydrate theme from storage / DOM on mount.
  React.useEffect(() => {
    try {
      const fromDom = document.documentElement.getAttribute("data-theme");
      const stored =
        window.localStorage.getItem(THEME_STORAGE_KEY) ?? fromDom ?? "";
      if (isThemeId(stored)) {
        setTheme(stored);
      }
    } catch {
      // ignore
    }
    setSessionId(getOrCreateSessionId());
    setModKey(modKeyLabel());
  }, []);

  // Apply theme to <html> + persist.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Keyboard shortcuts: Cmd/Ctrl+K focus, Cmd/Ctrl+D download, Esc blur.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (mod && key === "d") {
        e.preventDefault();
        const a = downloadAnchorRef.current;
        if (a) a.click();
      } else if (e.key === "Escape") {
        const active = document.activeElement;
        if (active && active instanceof HTMLElement) active.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const candidate = profile.candidate;
  const displayRole = deriveDisplayRole(profile);
  const contact = {
    email: candidate.email,
    phone: candidate.phone,
    linkedin: candidate.links.linkedin,
    github: candidate.links.github,
    leetcode: candidate.links.leetcode,
  };

  return (
    <div className="flex h-screen min-h-0 flex-col bg-bg text-fg">
      <header
        className={cn(
          "flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4 md:px-6"
        )}
      >
        <div className="min-w-0 truncate text-[14px] font-semibold text-fg">
          {candidate.name}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 font-mono text-[13px] text-fg-subtle sm:inline-flex">
            <kbd className="rounded-md border border-border bg-panel-soft px-1.5 py-0.5 text-[11px] leading-none text-fg-muted">
              {modKey}K
            </kbd>
            ask
          </span>
          <ThemeSwitcher current={theme} onChange={setTheme} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ResizableSplitPane
          left={
            <ResumePanel
              profile={profile}
              displayRole={displayRole}
              contact={contact}
              resumeHref={RESUME_HREF}
            />
          }
          right={
            sessionId ? (
              <ChatPanel
                sessionId={sessionId}
                theme={theme}
                inputRef={inputRef}
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full"
              />
            )
          }
          className="h-full"
        />
      </div>

      {/* Hidden anchor for Cmd/Ctrl+D download */}
      <a
        ref={downloadAnchorRef}
        href={RESUME_HREF}
        download={RESUME_FILENAME}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        Download resume
      </a>
    </div>
  );
}

export default ResumeWebsiteLayout;
