"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationContextValue {
  scrollToBottom: () => void;
  isAtBottom: boolean;
  registerScrollable: (el: HTMLDivElement | null) => void;
}

const ConversationContext = React.createContext<ConversationContextValue | null>(
  null
);

export function useConversationContext(): ConversationContextValue {
  const ctx = React.useContext(ConversationContext);
  if (!ctx) {
    throw new Error(
      "useConversationContext must be used within a <Conversation />"
    );
  }
  return ctx;
}

export interface ConversationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Conversation({
  className,
  children,
  ...props
}: ConversationProps) {
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const stickRef = React.useRef(true);
  const scrollableRef = React.useRef<HTMLDivElement | null>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);

  const updateStick = React.useCallback(() => {
    const el = scrollableRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distance < 24;
    stickRef.current = atBottom;
    setIsAtBottom(atBottom);
    el.dataset.stick = atBottom ? "true" : "false";
  }, []);

  const scrollToBottom = React.useCallback(() => {
    const el = scrollableRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    stickRef.current = true;
    setIsAtBottom(true);
  }, []);

  const registerScrollable = React.useCallback(
    (el: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      scrollableRef.current = el;
      if (!el) return;
      el.dataset.stick = "true";

      const onScroll = () => updateStick();
      el.addEventListener("scroll", onScroll, { passive: true });

      const ro = new ResizeObserver(() => {
        if (stickRef.current) {
          el.scrollTop = el.scrollHeight;
        }
        updateStick();
      });
      ro.observe(el);
      // Also observe first child for content growth
      if (el.firstElementChild) {
        ro.observe(el.firstElementChild);
      }
      observerRef.current = ro;

      // Initial
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
        updateStick();
      });

      // Cleanup attachment via dataset (handled on next register call)
    },
    [updateStick]
  );

  React.useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const value = React.useMemo(
    () => ({ scrollToBottom, isAtBottom, registerScrollable }),
    [scrollToBottom, isAtBottom, registerScrollable]
  );

  return (
    <ConversationContext.Provider value={value}>
      <div
        className={cn("relative flex h-full w-full flex-col", className)}
        {...props}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  );
}

export interface ConversationContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ConversationContent = React.forwardRef<
  HTMLDivElement,
  ConversationContentProps
>(function ConversationContent({ className, children, ...props }, ref) {
  const { registerScrollable } = useConversationContext();
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      registerScrollable(node);
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref, registerScrollable]
  );

  return (
    <div
      ref={setRef}
      className={cn(
        "flex h-full flex-col gap-5 overflow-y-auto p-5 scrollbar-clean",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ConversationContent.displayName = "ConversationContent";

export interface ConversationEmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function ConversationEmptyState({
  icon,
  title,
  description,
  children,
  className,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full max-w-[36ch] flex-col items-center justify-center gap-3 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="text-fg-subtle" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      {title ? (
        <h3 className="text-[15.5px] font-medium text-fg">{title}</h3>
      ) : null}
      {description ? (
        <p className="text-[13.5px] leading-relaxed text-fg-muted">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-1 w-full">{children}</div> : null}
    </div>
  );
}

export interface ConversationScrollButtonProps
  extends React.ComponentProps<typeof Button> {}

export function ConversationScrollButton({
  className,
  onClick,
  ...props
}: ConversationScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useConversationContext();
  if (isAtBottom) return null;
  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Scroll to latest"
      className={cn(
        "absolute bottom-4 right-4 rounded-full shadow-none",
        className
      )}
      onClick={(e) => {
        scrollToBottom();
        onClick?.(e);
      }}
      {...props}
    >
      <ArrowDown size={14} strokeWidth={1.6} />
    </Button>
  );
}
