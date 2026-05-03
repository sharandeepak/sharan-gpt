"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/ChatInput";
import {
  ChatMessageList,
  type DisplayedMessage,
} from "@/components/ChatMessageList";
import {
  SuggestedQuestions,
  type SuggestedItem,
} from "@/components/SuggestedQuestions";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";

export interface ChatPanelProps {
  sessionId: string;
  theme: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

const FALLBACK_SUGGESTIONS: SuggestedItem[] = [
  { id: "who-is-sharan-deepak", question: "Who is Sharan Deepak?", category: "overview", priority: 1 },
  { id: "what-are-his-strongest-backend-skills", question: "What are his strongest backend skills?", category: "skills", priority: 2 },
  { id: "what-impact-did-he-create-at-surveysparrow", question: "What impact did he create at SurveySparrow?", category: "impact", priority: 3 },
  { id: "has-he-worked-on-scalable-systems", question: "Has he worked on scalable systems?", category: "impact", priority: 4 },
  { id: "what-are-his-elasticsearch-and-postgresql-achievements", question: "What are his Elasticsearch and PostgreSQL achievements?", category: "skills", priority: 5 },
  { id: "what-makes-him-suitable-for-a-senior-developer-role", question: "What makes him suitable for a senior developer role?", category: "overview", priority: 6 },
  { id: "has-he-worked-with-ai-tools", question: "Has he worked with AI tools?", category: "tools", priority: 7 },
  { id: "has-he-built-mobile-apps", question: "Has he built mobile apps?", category: "projects", priority: 8 },
  { id: "what-are-his-strongest-projects", question: "What are his strongest projects?", category: "projects", priority: 9 },
  { id: "how-can-i-contact-him", question: "How can I contact him?", category: "contact", priority: 10 },
];

interface CuratedTurn {
  userId: string;
  assistantId: string;
  matchedQuestionId: string;
  question: string;
}

interface PromptMorph {
  text: string;
  from: DOMRect;
  to: DOMRect;
  active: boolean;
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function readAssistantText(message: { content?: string; parts?: Array<{ type: string; text?: string }> }): string {
  if (typeof message.content === "string" && message.content.length > 0) {
    return message.content;
  }
  const parts = message.parts;
  if (Array.isArray(parts)) {
    return parts
      .filter((p) => p && p.type === "text" && typeof p.text === "string")
      .map((p) => p.text as string)
      .join("");
  }
  return "";
}

function useTypewriterPhrases(
  phrases: string[],
  paused: boolean
): { displayedText: string; fullText: string } {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (paused || phrases.length === 0) return;

    const current = phrases[phraseIndex] ?? "";
    const reachedEnd = !isDeleting && charIndex === current.length;
    const reachedStart = isDeleting && charIndex === 0;

    const timeout = window.setTimeout(
      () => {
        if (reachedEnd) {
          setIsDeleting(true);
          return;
        }
        if (reachedStart) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          return;
        }
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      reachedEnd ? 1500 : isDeleting ? 26 : 42
    );

    return () => window.clearTimeout(timeout);
  }, [charIndex, isDeleting, paused, phraseIndex, phrases]);

  const fullText = phrases[phraseIndex] ?? "";
  return {
    displayedText: fullText.slice(0, charIndex),
    fullText,
  };
}

export function ChatPanel({ sessionId, theme, inputRef }: ChatPanelProps) {
  const toast = useToast();
  const [suggestions, setSuggestions] = React.useState<SuggestedItem[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = React.useState(true);
  const [composerValue, setComposerValue] = React.useState("");
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);
  const [curatedStreaming, setCuratedStreaming] = React.useState(false);
  const [composerPrimed, setComposerPrimed] = React.useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = React.useState(true);
  const [promptMorph, setPromptMorph] = React.useState<PromptMorph | null>(
    null
  );
  const [, setLiveAnnouncement] = React.useState("");

  // Curated turns kept locally — they don't go through the chat API.
  const [curatedMessages, setCuratedMessages] = React.useState<DisplayedMessage[]>([]);
  const curatedIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSourceRef = React.useRef<"free_text" | "suggested_question" | null>(null);
  const promptCardRef = React.useRef<HTMLButtonElement | null>(null);
  const composerRef = React.useRef<HTMLDivElement | null>(null);
  const promptTimersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const pagePath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // AI SDK v4 useChat
  const {
    messages: aiMessages,
    append,
    status,
    error,
  } = useChat({
    api: "/api/chat",
    body: {
      sessionId,
      theme,
      pagePath,
    },
    headers: {
      "x-session-id": sessionId,
    },
    onError: (e: unknown) => {
      console.error("[chat] error", e);
      setErrorBanner(
        "Something interrupted that response. Try again, or contact directly."
      );
    },
    onFinish: () => {
      // free_text logging is server-side; nothing to do here.
      setLiveAnnouncement("Assistant response complete.");
    },
  });

  // Fetch suggestions
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/suggested-questions", { method: "GET" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as { items?: SuggestedItem[] };
        if (cancelled) return;
        if (Array.isArray(data.items) && data.items.length > 0) {
          setSuggestions(data.items);
        } else {
          setSuggestions(FALLBACK_SUGGESTIONS);
        }
      } catch {
        if (!cancelled) setSuggestions(FALLBACK_SUGGESTIONS);
      } finally {
        if (!cancelled) setSuggestionsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cleanup curated interval on unmount
  React.useEffect(() => {
    return () => {
      if (curatedIntervalRef.current) clearInterval(curatedIntervalRef.current);
      promptTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Compose unified message list: AI SDK messages + curated messages.
  const aiDisplayed: DisplayedMessage[] = React.useMemo(() => {
    type AiMsg = { id: string; role: string };
    return (aiMessages as AiMsg[]).map((m: AiMsg, i: number) => {
      const isLast = i === aiMessages.length - 1;
      return {
        id: m.id,
        role: m.role === "user" ? "user" : "assistant",
        text:
          m.role === "user"
            ? readAssistantText(m as never).trim() || readAssistantText(m as never)
            : readAssistantText(m as never),
        isStreaming:
          m.role !== "user" && isLast && status === "streaming",
        isCurated: false,
      };
    });
  }, [aiMessages, status]);

  const allMessages: DisplayedMessage[] = React.useMemo(() => {
    return [...aiDisplayed, ...curatedMessages];
  }, [aiDisplayed, curatedMessages]);

  // Clear error when a new message starts
  React.useEffect(() => {
    if (status === "streaming" || status === "submitted") {
      setErrorBanner(null);
    }
  }, [status]);

  React.useEffect(() => {
    if (error) {
      setErrorBanner(
        "Something interrupted that response. Try again, or contact directly."
      );
    }
  }, [error]);

  // Live region announcements at start of streaming
  React.useEffect(() => {
    if (status === "streaming") {
      setLiveAnnouncement("Assistant is responding.");
    }
  }, [status]);

  const isBusy = status === "streaming" || status === "submitted" || curatedStreaming;

  const handleFreeFormSubmit = React.useCallback(
    (text: string) => {
      if (!text || isBusy) return;
      lastSourceRef.current = "free_text";
      setSuggestionsVisible(true);
      setComposerValue("");
      setErrorBanner(null);
      append(
        { role: "user", content: text },
        {
          body: { sessionId, theme, pagePath },
        }
      );
    },
    [append, isBusy, sessionId, theme, pagePath]
  );

  const trackQuestion = React.useCallback(
    async (params: {
      source: "suggested_question" | "free_text";
      question: string;
      response: string;
      matchedSuggestedQuestionId?: string | null;
    }) => {
      try {
        await fetch("/api/track-question", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId,
            source: params.source,
            question: params.question,
            response: params.response,
            matchedSuggestedQuestionId: params.matchedSuggestedQuestionId ?? null,
            pagePath,
            theme,
          }),
        });
      } catch (err) {
        console.error("[chat] track-question failed", err);
      }
    },
    [sessionId, theme, pagePath]
  );

  const animateCuratedAnswer = React.useCallback(
    (assistantId: string, fullText: string, onComplete: () => void) => {
      if (curatedIntervalRef.current) {
        clearInterval(curatedIntervalRef.current);
        curatedIntervalRef.current = null;
      }
      const chunkSize = 7;
      let cursor = 0;
      setCuratedStreaming(true);
      setLiveAnnouncement("Assistant is responding.");
      const tick = () => {
        cursor = Math.min(cursor + chunkSize, fullText.length);
        const slice = fullText.slice(0, cursor);
        setCuratedMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: slice, isStreaming: cursor < fullText.length }
              : m
          )
        );
        if (cursor >= fullText.length) {
          if (curatedIntervalRef.current) {
            clearInterval(curatedIntervalRef.current);
            curatedIntervalRef.current = null;
          }
          setCuratedStreaming(false);
          setLiveAnnouncement("Assistant response complete.");
          onComplete();
        }
      };
      curatedIntervalRef.current = setInterval(tick, 28);
    },
    []
  );

  const handleSuggestionSelect = React.useCallback(
    async (item: SuggestedItem) => {
      if (isBusy) return;
      setSuggestionsVisible(true);
      const turn: CuratedTurn = {
        userId: uid("u"),
        assistantId: uid("a"),
        matchedQuestionId: item.id,
        question: item.question,
      };

      // 1. Append user turn locally + assistant placeholder.
      setCuratedMessages((prev) => [
        ...prev,
        { id: turn.userId, role: "user", text: item.question, isCurated: false },
        {
          id: turn.assistantId,
          role: "assistant",
          text: "",
          isStreaming: true,
          isCurated: true,
        },
      ]);
      setCuratedStreaming(true);

      // 2. Lookup curated answer.
      let curatedAnswer = "";
      try {
        const res = await fetch("/api/suggested-questions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as { answer?: string };
        curatedAnswer = typeof data.answer === "string" ? data.answer : "";
      } catch {
        // Drop the curated placeholder and fall back to free-form chat.
        setCuratedMessages((prev) =>
          prev.filter(
            (m) => m.id !== turn.userId && m.id !== turn.assistantId
          )
        );
        setCuratedStreaming(false);
        toast({
          title: "Curated answer unavailable",
          description: "Asking the assistant instead.",
          tone: "info",
        });
        handleFreeFormSubmit(item.question);
        return;
      }

      if (!curatedAnswer.trim()) {
        // Treat empty curated answer as fallback path.
        setCuratedMessages((prev) =>
          prev.filter(
            (m) => m.id !== turn.userId && m.id !== turn.assistantId
          )
        );
        setCuratedStreaming(false);
        handleFreeFormSubmit(item.question);
        return;
      }

      // 3. Stream-animate the answer.
      animateCuratedAnswer(turn.assistantId, curatedAnswer, () => {
        // 4. Track the click.
        void trackQuestion({
          source: "suggested_question",
          question: turn.question,
          response: curatedAnswer,
          matchedSuggestedQuestionId: turn.matchedQuestionId,
        });
      });
    },
    [animateCuratedAnswer, handleFreeFormSubmit, isBusy, toast, trackQuestion]
  );

  const visibleSuggestions = suggestions.slice(0, 6);
  const shouldShowSuggestions =
    visibleSuggestions.length > 0 &&
    (allMessages.length === 0 || suggestionsVisible);
  const { displayedText: typewriterPrompt, fullText: fullPrompt } =
    useTypewriterPhrases(
    [
      "What did Sharan build that scaled to 300,000+ users?",
      "Where has Sharan shown backend judgment under pressure?",
      "How does Sharan use AI workflows in real product work?",
    ],
    allMessages.length > 0 || suggestionsLoading
    );

  const queuePromptTimer = React.useCallback((callback: () => void, ms: number) => {
    const timer = setTimeout(() => {
      promptTimersRef.current = promptTimersRef.current.filter((t) => t !== timer);
      callback();
    }, ms);
    promptTimersRef.current.push(timer);
  }, []);

  const primeComposerWithPrompt = React.useCallback(() => {
    const promptText =
      fullPrompt.trim() ||
      "What did Sharan build that scaled to 300,000+ users?";
    const source = promptCardRef.current;
    const composerForm = composerRef.current?.querySelector("form");
    const target =
      composerForm instanceof HTMLElement ? composerForm : composerRef.current;

    promptTimersRef.current.forEach(clearTimeout);
    promptTimersRef.current = [];

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    inputRef?.current?.focus();

    if (!source || !target || reducedMotion) {
      setComposerValue(promptText);
      setComposerPrimed(true);
      queuePromptTimer(() => setComposerPrimed(false), 1200);
      return;
    }

    setComposerValue("");
    setComposerPrimed(false);
    setPromptMorph({
      text: promptText,
      from: source.getBoundingClientRect(),
      to: target.getBoundingClientRect(),
      active: false,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPromptMorph((current) =>
          current ? { ...current, active: true } : current
        );
      });
    });

    queuePromptTimer(() => {
      inputRef?.current?.focus();
      setComposerPrimed(true);
    }, 260);

    queuePromptTimer(() => {
      let cursor = 0;
      const tick = () => {
        cursor = Math.min(cursor + 4, promptText.length);
        setComposerValue(promptText.slice(0, cursor));
        if (cursor < promptText.length) {
          queuePromptTimer(tick, 16);
        }
      };
      tick();
    }, 410);

    queuePromptTimer(() => setPromptMorph(null), 780);
    queuePromptTimer(() => setComposerPrimed(false), 1600);
  }, [fullPrompt, inputRef, queuePromptTimer]);

  // Map AI SDK v4 status to PromptInput status.
  const promptStatus: "ready" | "streaming" | "submitted" | "error" =
    status === "streaming"
      ? "streaming"
      : status === "submitted"
        ? "submitted"
        : status === "error"
          ? "error"
          : curatedStreaming
            ? "streaming"
            : "ready";

  const lastAssistant = [...allMessages].reverse().find((m) => m.role === "assistant");
  const lastAssistantPreview = lastAssistant
    ? lastAssistant.isStreaming
      ? "Assistant is responding."
      : "Assistant response complete."
    : "";

  const emptyState = (
    <div className="flex w-full max-w-[42rem] flex-col items-start justify-center gap-4 text-left">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[19px] font-semibold leading-[1.2] text-fg sm:text-[22px]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Ask about Sharan
        </h2>
      </div>
      <button
        ref={promptCardRef}
        type="button"
        onClick={primeComposerWithPrompt}
        className={cn(
          "group relative w-full max-w-[38rem] overflow-hidden rounded-2xl border border-border bg-panel-soft/60 px-4 py-4 text-left transition-[transform,opacity,border-color,background-color,box-shadow] duration-300 ease-[var(--ease-out-quart)] sm:px-5 sm:py-5",
          "hover:-translate-y-0.5 hover:border-border-strong hover:bg-panel-soft/80",
          "focus-visible:border-accent focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--color-accent),0_0_0_6px_color-mix(in_oklch,var(--color-accent)_14%,transparent)]",
          promptMorph && "scale-[0.985] opacity-35"
        )}
      >
        <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] text-fg-subtle">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
          recruiter prompt
        </div>
        <div className="min-h-[4.5rem] text-[18px] font-medium leading-[1.45] text-fg sm:min-h-[5rem] sm:text-[22px]">
          {typewriterPrompt}
          <span className="caret-pulse" aria-hidden="true" />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-[-115%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.16),transparent)] transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:translate-x-[115%]"
        />
      </button>
    </div>
  );

  return (
    <section
      aria-label="Resume assistant"
      className={cn(
        "flex h-full min-h-0 flex-col gap-3 p-5 md:p-6"
      )}
    >
      <div className="sr-only" role="status" aria-live="polite">
        {lastAssistantPreview}
      </div>

      <ChatMessageList
        messages={allMessages}
        emptyState={emptyState}
        onUserScrollDirectionChange={(direction) => {
          if (allMessages.length === 0) return;
          setSuggestionsVisible(direction === "down");
        }}
      />

      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity,transform] duration-300 ease-[var(--ease-out-quart)]",
            shouldShowSuggestions
              ? "grid-rows-[1fr] opacity-100 translate-y-0"
              : "pointer-events-none grid-rows-[0fr] opacity-0 translate-y-1"
          )}
          aria-hidden={!shouldShowSuggestions}
        >
          <div className="min-h-0 overflow-hidden">
            {visibleSuggestions.length > 0 ? (
              <SuggestedQuestions
                items={visibleSuggestions}
                onSelect={handleSuggestionSelect}
                loading={suggestionsLoading}
                disabled={isBusy}
                variant="row"
                className="w-full pb-1"
              />
            ) : null}
          </div>
        </div>

        {errorBanner ? (
          <div className="px-1 text-[13px] text-danger" role="alert">
            {errorBanner}
          </div>
        ) : null}

        <ChatInput
          value={composerValue}
          onChange={setComposerValue}
          onSubmit={handleFreeFormSubmit}
          status={promptStatus}
          disabled={isBusy}
          inputRef={inputRef}
          containerRef={composerRef}
          isPrimed={composerPrimed}
        />
      </div>

      {promptMorph ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 overflow-hidden rounded-2xl border border-border bg-panel-soft/95 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-[3px] transition-[left,top,width,height,opacity,border-radius,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            left: promptMorph.active ? promptMorph.to.left : promptMorph.from.left,
            top: promptMorph.active ? promptMorph.to.top : promptMorph.from.top,
            width: promptMorph.active ? promptMorph.to.width : promptMorph.from.width,
            height: promptMorph.active ? promptMorph.to.height : promptMorph.from.height,
            borderRadius: promptMorph.active ? 12 : 16,
            opacity: promptMorph.active ? 0.12 : 0.98,
            transform: promptMorph.active ? "scale(0.98)" : "scale(1)",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 ease-[var(--ease-out-quart)]",
              promptMorph.active ? "translate-x-[115%]" : "translate-x-[-115%]"
            )}
          />
          <div className="relative flex h-full flex-col justify-between px-4 py-4 sm:px-5 sm:py-5">
            <div
              className={cn(
                "flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] text-fg-subtle transition-opacity duration-300",
                promptMorph.active && "opacity-0"
              )}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
              recruiter prompt
            </div>
            <div
              className={cn(
                "truncate text-[18px] font-medium leading-[1.4] text-fg transition-[font-size,opacity,transform] duration-500 ease-[var(--ease-out-quart)]",
                promptMorph.active &&
                  "translate-y-[-2px] text-[13px] opacity-80"
              )}
            >
              {promptMorph.text}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ChatPanel;
