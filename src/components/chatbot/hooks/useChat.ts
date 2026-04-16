"use client";

import { useState, useRef, useEffect } from "react";
import type { Message } from "../types";
import { fetchReply, GREETING } from "../lib/api";

export function useChat() {
  const [mounted,  setMounted]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  /* mount guard — tránh hydration mismatch */
  useEffect(() => { setMounted(true); }, []);

  /* scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* focus input + clear unread khi mở */
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  /* greeting lần đầu mở */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: GREETING,
        createdAt: new Date(),
      }]);
    }
  }, [open, messages.length]);

  /* ── actions ── */
  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const reply = await fetchReply(next);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply, createdAt: new Date() },
      ]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "❌ Không thể kết nối với server. Vui lòng thử lại sau.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const reset   = () => setMessages([]);
  const toggleOpen = () => setOpen((v) => !v);
  const closeChat  = () => setOpen(false);

  return {
    mounted, open, toggleOpen, closeChat,
    messages, input, setInput,
    loading, unread,
    send, handleKey, reset,
    bottomRef, inputRef,
  };
}
