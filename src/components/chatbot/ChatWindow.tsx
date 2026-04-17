"use client";

import { Bot, RotateCcw, ChevronDown } from "lucide-react";
import { type RefObject } from "react";
import { isConnected } from "./lib/api";
import MessageList from "./MessageList";
import SuggestedPrompts from "./SuggestedPrompts";
import ChatInput from "./ChatInput";
import type { Message } from "./types";

interface Props {
  messages: Message[];
  input: string;
  loading: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  onInput: (v: string) => void;
  onSend: (text?: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function ChatWindow({
  messages, input, loading,
  inputRef, bottomRef,
  onInput, onSend, onKeyDown,
  onReset, onClose,
}: Props) {
  const hasUserMsg = messages.some((m) => m.role === "user");

  return (
    <div
      className="flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
      style={{ width: 360, height: 520, animation: "chatIn .2s cubic-bezier(.16,1,.3,1)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Bot size={17} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">WMS Assistant</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-indigo-200">
              {isConnected ? "Đã kết nối" : "Chế độ demo · Chờ kết nối backend"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            title="Cuộc hội thoại mới"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
          >
            <ChevronDown size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} loading={loading} bottomRef={bottomRef} />

      {/* Suggested prompts — ẩn sau khi user đã nhắn */}
      <SuggestedPrompts visible={!hasUserMsg} onSelect={onSend} />

      {/* Input */}
      <ChatInput
        input={input}
        loading={loading}
        inputRef={inputRef}
        onChange={onInput}
        onSend={() => onSend()}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
