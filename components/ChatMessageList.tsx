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
}

export function ChatMessageList({ messages, emptyState }: ChatMessageListProps) {
  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent>
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
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

export default ChatMessageList;
