"use client";

import * as React from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";

export interface DisplayedMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** True if assistant text is currently streaming. */
  isStreaming?: boolean;
  /** True if this is a curated answer (suggested-question source). */
  isCurated?: boolean;
}

export interface ChatMessageListProps {
  messages: DisplayedMessage[];
  /** Render slot above the messages, e.g. an empty state. */
  emptyState: React.ReactNode;
  onUserScrollDirectionChange?: (direction: "up" | "down") => void;
}

export function ChatMessageList({
  messages,
  emptyState,
  onUserScrollDirectionChange,
}: ChatMessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = React.useRef(0);
  const ignoreScrollUntilRef = React.useRef(0);
  const lastMessage = messages[messages.length - 1];
  const scrollSignal = lastMessage
    ? `${messages.length}:${lastMessage.id}:${lastMessage.text.length}:${lastMessage.isStreaming ? "streaming" : "done"}`
    : "empty";

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
    ignoreScrollUntilRef.current = Date.now() + 350;
    bottomRef.current?.scrollIntoView({ block: "end", behavior });
  }, []);

  React.useEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom("smooth");
  }, [messages.length, scrollToBottom]);

  React.useEffect(() => {
    if (!lastMessage?.isStreaming) return;
    scrollToBottom("auto");
  }, [lastMessage?.isStreaming, scrollSignal, scrollToBottom]);

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const current = event.currentTarget.scrollTop;
      const previous = lastScrollTopRef.current;
      lastScrollTopRef.current = current;

      if (!onUserScrollDirectionChange) return;
      if (Date.now() < ignoreScrollUntilRef.current) return;

      const delta = current - previous;
      if (Math.abs(delta) < 10) return;
      onUserScrollDirectionChange(delta > 0 ? "down" : "up");
    },
    [onUserScrollDirectionChange]
  );

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent onScroll={handleScroll}>
        {messages.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            {emptyState}
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === "user";
            const showStreamingCaret = !isUser && m.isStreaming === true;
            return (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {!isUser && m.isCurated ? (
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-fg-subtle">
                      From curated answers
                    </div>
                  ) : null}
                  {isUser ? (
                    <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed">
                      {m.text}
                    </p>
                  ) : (
                    <div className={cn(showStreamingCaret && "caret-pulse")}>
                      <MessageResponse>{m.text || ""}</MessageResponse>
                    </div>
                  )}
                </MessageContent>
              </Message>
            );
          })
        )}
        <div ref={bottomRef} aria-hidden="true" className="h-px shrink-0" />
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

export default ChatMessageList;
