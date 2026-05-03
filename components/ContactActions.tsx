"use client";

import * as React from "react";
import {
  Download,
  Mail,
  MessageSquare,
  Linkedin,
  Github,
  Code2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ContactActionsProps {
  email: string;
  phone?: string;
  linkedin: string | null;
  github: string | null;
  leetcode: string | null;
  resumeHref: string;
  className?: string;
}

function useCopyState(timeout = 1500) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // ignore
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
    },
    [timeout]
  );
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  return { copied, trigger };
}

function CopyRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const { copied, trigger } = useCopyState();
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex min-w-0 flex-col">
        <span className="text-[11px] uppercase tracking-wide text-fg-subtle">
          {label}
        </span>
        {href ? (
          <a
            href={href}
            className="truncate text-[13.5px] text-fg hover:underline"
          >
            {value}
          </a>
        ) : (
          <span className="truncate text-[13.5px] text-fg">{value}</span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => trigger(value)}
        aria-label={`Copy ${label}`}
        className="h-7 px-2"
      >
        {copied ? (
          <>
            <Check size={14} strokeWidth={1.6} />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} strokeWidth={1.6} />
            <span>Copy</span>
          </>
        )}
      </Button>
    </div>
  );
}

function isUrl(value: string | null | undefined): value is string {
  return Boolean(value?.startsWith("http://") || value?.startsWith("https://"));
}

function SocialAction({
  href,
  label,
  icon,
}: {
  href: string | null;
  label: string;
  icon: React.ReactNode;
}) {
  if (!href) return null;

  if (!isUrl(href)) {
    return (
      <Button variant="outline" size="md" disabled title={`${label} link not configured`}>
        {icon}
        <span>{label}</span>
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="md">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${label} profile`}
      >
        {icon}
        <span>{label}</span>
        <ExternalLink size={12} strokeWidth={1.6} className="text-fg-subtle" />
      </a>
    </Button>
  );
}

export function ContactActions({
  email,
  phone,
  linkedin,
  github,
  leetcode,
  resumeHref,
  className,
}: ContactActionsProps) {
  const [emailLabel, setEmailLabel] = React.useState<"Email" | "Copied">(
    "Email"
  );
  const emailTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEmailClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // ignore
    }
    setEmailLabel("Copied");
    if (emailTimer.current) clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(() => setEmailLabel("Email"), 1500);
    setTimeout(() => {
      window.location.href = `mailto:${email}`;
    }, 200);
  };

  React.useEffect(
    () => () => {
      if (emailTimer.current) clearTimeout(emailTimer.current);
    },
    []
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="primary" size="md">
          <a href={resumeHref} download>
            <Download size={14} strokeWidth={1.6} />
            <span>Download resume</span>
          </a>
        </Button>

        <Button asChild variant="secondary" size="md">
          <a href={resumeHref} target="_blank" rel="noreferrer noopener">
            <ExternalLink size={14} strokeWidth={1.6} />
            <span>View resume</span>
          </a>
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={handleEmailClick}
          aria-label="Copy email and open mail client"
        >
          {emailLabel === "Copied" ? (
            <Check size={14} strokeWidth={1.6} />
          ) : (
            <Mail size={14} strokeWidth={1.6} />
          )}
          <span>{emailLabel}</span>
        </Button>

        <details className="group/contact relative">
          <summary
            className={cn(
              "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-transparent px-4 text-[14px] text-fg",
              "transition-colors duration-[120ms] ease-[var(--ease-out-quart)] hover:bg-panel-soft",
              "list-none [&::-webkit-details-marker]:hidden"
            )}
            aria-label="Contact details"
          >
            <MessageSquare size={14} strokeWidth={1.6} />
            <span>Contact</span>
          </summary>
          <div className="absolute left-0 top-[calc(100%+6px)] z-10 w-[300px] rounded-md border border-border bg-panel p-3">
            <CopyRow label="Email" value={email} href={`mailto:${email}`} />
            {phone ? (
              <>
                <div className="my-1 h-px bg-border" />
                <CopyRow
                  label="Phone"
                  value={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                />
              </>
            ) : null}
          </div>
        </details>

        <SocialAction
          href={linkedin}
          label="LinkedIn"
          icon={<Linkedin size={14} strokeWidth={1.6} />}
        />

        <SocialAction
          href={github}
          label="GitHub"
          icon={<Github size={14} strokeWidth={1.6} />}
        />

        <SocialAction
          href={leetcode}
          label="Leetcode"
          icon={<Code2 size={14} strokeWidth={1.6} />}
        />
      </div>
    </div>
  );
}

export default ContactActions;
