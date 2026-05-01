"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MessageRole = "user" | "assistant" | "system";

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from: MessageRole;
}

export function Message({
  from,
  className,
  children,
  ...props
}: MessageProps) {
  const isUser = from === "user";
  return (
    <div
      data-role={from}
      className={cn(
        "group/message flex w-full",
        isUser
          ? "is-user justify-end"
          : from === "assistant"
            ? "is-assistant justify-start"
            : "is-system justify-start",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageContent({
  className,
  children,
  ...props
}: MessageContentProps) {
  return (
    <div
      className={cn(
        "min-w-0",
        // user content gets pill bubble; assistant gets full-width
        "group-[.is-user]/message:max-w-[85%] group-[.is-user]/message:self-end",
        "group-[.is-user]/message:rounded-2xl group-[.is-user]/message:border group-[.is-user]/message:border-border",
        "group-[.is-user]/message:bg-panel-soft group-[.is-user]/message:px-4 group-[.is-user]/message:py-2",
        "group-[.is-user]/message:text-fg",
        "group-[.is-assistant]/message:w-full group-[.is-assistant]/message:text-fg group-[.is-assistant]/message:mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageResponseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: string;
}

const markdownComponents: Components = {
  h1: ({ className, ...props }) => (
    <h3
      className={cn("mt-3 mb-1 text-[15.5px] font-semibold text-fg", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h4
      className={cn("mt-3 mb-1 text-[14.5px] font-semibold text-fg", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h5
      className={cn("mt-2 mb-1 text-[14px] font-semibold text-fg", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "text-[14.5px] leading-relaxed text-fg [&:not(:last-child)]:mb-2",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mb-2 ml-5 list-disc space-y-1 text-[14.5px] leading-relaxed marker:text-fg-subtle",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "mb-2 ml-5 list-decimal space-y-1 text-[14.5px] leading-relaxed marker:text-fg-subtle",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("text-fg", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-accent underline-offset-2 hover:underline",
        className
      )}
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => {
    const inline = !/language-/.test(className ?? "");
    if (inline) {
      return (
        <code
          className={cn(
            "rounded-sm bg-panel-soft px-1 py-0.5 font-mono text-[12.5px] text-fg",
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn("font-mono text-[12.5px]", className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mb-2 overflow-x-auto rounded-md border border-border bg-panel-soft px-3 py-2 font-mono text-[12.5px] leading-relaxed text-fg",
        className
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mb-2 border-l-2 border-border pl-3 text-fg-muted italic",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-3 border-border", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-fg", className)} {...props} />
  ),
};

export function MessageResponse({
  children,
  className,
  ...props
}: MessageResponseProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  );
}

export interface MessageActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageActions({
  className,
  children,
  ...props
}: MessageActionsProps) {
  return (
    <div
      className={cn(
        "mt-1 flex items-center gap-1 text-fg-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageActionProps extends ButtonProps {
  label: string;
  tooltip?: string;
}

export const MessageAction = React.forwardRef<
  HTMLButtonElement,
  MessageActionProps
>(function MessageAction(
  { label, tooltip, className, children, ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      aria-label={label}
      title={tooltip ?? label}
      className={cn("h-7 w-7", className)}
      {...props}
    >
      {children}
    </Button>
  );
});

MessageAction.displayName = "MessageAction";
