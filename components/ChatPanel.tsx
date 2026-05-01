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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

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

export function ChatPanel({ sessionId, theme, inputRef }: ChatPanelProps) {
  const toast = useToast();
  const [suggestions, setSuggestions] = React.useState<SuggestedItem[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = React.useState(true);
  const [composerValue, setComposerValue] = React.useState("");
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);
  const [curatedStreaming, setCuratedStreaming] = React.useState(false);
  const [, setLiveAnnouncement] = React.useState("");

  // Curated turns kept locally — they don't go through the chat API.
  const [curatedMessages, setCuratedMessages] = React.useState<DisplayedMessage[]>([]);
  const curatedIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSourceRef = React.useRef<"free_text" | "suggested_question" | null>(null);

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

  const refreshSuggestions = React.useCallback(async () => {
    setSuggestionsLoading(true);
    try {
      const res = await fetch("/api/suggested-questions", { method: "GET" });
      const data = (await res.json()) as { items?: SuggestedItem[] };
      if (Array.isArray(data.items) && data.items.length > 0) {
        setSuggestions(data.items);
      }
    } catch {
      // ignore
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const visibleSuggestions = suggestions.slice(0, 6);
  const heroSuggestions = suggestions.slice(0, 4);

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
    <div className="flex w-full max-w-[44ch] flex-col items-start gap-4 text-left">
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-[19px] font-semibold leading-[1.2] text-fg"
          style={{ letterSpacing: "-0.01em" }}
        >
          Ask about Sharan
        </h2>
        <p className="text-[14px] leading-[1.5] text-fg-muted">
          Recruiters usually want to know about scaling, impact, AI tooling,
          and mobile work.
        </p>
      </div>
      <SuggestedQuestions
        items={heroSuggestions}
        onSelect={handleSuggestionSelect}
        loading={suggestionsLoading}
        disabled={isBusy}
        variant="grid"
        className="w-full"
      />
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

      <ChatMessageList messages={allMessages} emptyState={emptyState} />

      <div className="flex flex-col gap-2">
        {visibleSuggestions.length > 0 ? (
          <div className="flex items-center gap-2">
            <SuggestedQuestions
              items={visibleSuggestions}
              onSelect={handleSuggestionSelect}
              loading={suggestionsLoading}
              disabled={isBusy}
              variant="row"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              aria-label="Refresh suggestions"
              onClick={refreshSuggestions}
              disabled={suggestionsLoading || isBusy}
              className="h-7 px-2 text-fg-subtle"
            >
              <RefreshCw size={14} strokeWidth={1.6} />
              <span className="text-[12px]">Refresh</span>
            </Button>
          </div>
        ) : null}

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
        />
      </div>
    </section>
  );
}

export default ChatPanel;
