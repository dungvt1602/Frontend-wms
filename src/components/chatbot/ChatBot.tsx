"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MessageCircle, X, Send, Bot, User, Loader2,
  Sparkles, RotateCcw, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── types ── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

/* ── config – đổi URL này khi kết nối backend ── */
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL ?? "";

/* ── suggested prompts ── */
const SUGGESTIONS = [
  "Tồn kho hiện tại như thế nào?",
  "Sản phẩm nào sắp hết hàng?",
  "Tổng đơn hàng tháng này?",
  "Kho nào đang gần đầy?",
];

/* ── mock reply khi chưa có backend ── */
async function fetchReply(messages: Message[]): Promise<string> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.content ?? data.message ?? "Xin lỗi, tôi không hiểu câu hỏi này.";
  }

  /* placeholder khi chưa có backend */
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
  const q = messages[messages.length - 1]?.content.toLowerCase() ?? "";
  if (q.includes("tồn kho") || q.includes("hàng"))
    return "📦 Hiện tại hệ thống có **12 sản phẩm** đang được theo dõi. **2 sản phẩm** (Chuột Logitech MX Master 3, Webcam Logitech C920) đang **hết hàng**, và **3 sản phẩm** sắp dưới mức tối thiểu.\n\n_(Kết nối backend để nhận dữ liệu thực tế)_";
  if (q.includes("đơn hàng") || q.includes("order"))
    return "📋 Tháng này có **11 đơn hàng** (5 nhập kho, 6 xuất kho). Tổng giá trị xuất kho ước tính **~850 triệu ₫**.\n\n_(Kết nối backend để nhận dữ liệu thực tế)_";
  if (q.includes("kho") && (q.includes("đầy") || q.includes("công suất")))
    return "🏭 **Kho A – Kệ 3** đang ở **96% công suất** (gần đầy). **Kho B – Kệ 1 & 3** hiện đang trống hoàn toàn.\n\n_(Kết nối backend để nhận dữ liệu thực tế)_";
  return "Xin chào! Tôi là WMS Assistant 🤖\n\nTôi có thể giúp bạn tra cứu tồn kho, tình trạng đơn hàng, và thông tin kho bãi.\n\n_(Chức năng AI đầy đủ sẽ hoạt động khi kết nối Spring AI / FastAPI + RAG)_";
}

/* ── markdown-lite renderer (bold, newlines) ── */
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

/* ════════════════════════════════════════════════════════ */
export default function ChatBot() {
  const [mounted,  setMounted]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  /* scroll to bottom khi có tin nhắn mới */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* focus input khi mở */
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  /* greeting lần đầu */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: "Xin chào! Tôi là **WMS Assistant** 👋\n\nTôi có thể giúp bạn:\n• Kiểm tra tồn kho\n• Theo dõi đơn hàng\n• Xem tình trạng kho bãi\n\nBạn cần hỗ trợ gì?",
        createdAt: new Date(),
      }]);
    }
  }, [open, messages.length]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content, createdAt: new Date() };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const reply = await fetchReply(next);
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant", content: reply, createdAt: new Date(),
      }]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant",
        content: "❌ Không thể kết nối với server. Vui lòng thử lại sau.",
        createdAt: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const reset = () => setMessages([]);

  /* ── chỉ render sau khi mount để tránh hydration mismatch ── */
  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">

      {/* ── Chat window ── */}
      {open && (
        <div
          className="flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
          style={{
            width: 360,
            height: 520,
            animation: "chatIn .2s cubic-bezier(.16,1,.3,1)",
          }}
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
                  {API_URL ? "Đã kết nối" : "Chế độ demo · Chờ kết nối backend"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                title="Cuộc hội thoại mới"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
              >
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-2 items-end", m.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5",
                  m.role === "assistant"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-slate-200 text-slate-600"
                )}>
                  {m.role === "assistant" ? <Bot size={13} /> : <User size={12} />}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[76%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line",
                    m.role === "assistant"
                      ? "bg-slate-100 text-slate-800 rounded-bl-sm"
                      : "text-white rounded-br-sm"
                  )}
                  style={m.role === "user" ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
                >
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-end">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-indigo-600" />
                </div>
                <div className="px-3.5 py-3 bg-slate-100 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts — chỉ hiện khi chưa có tin nhắn user */}
          {messages.filter((m) => m.role === "user").length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex-shrink-0">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Nhập câu hỏi... (Enter để gửi)"
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none resize-none max-h-24 leading-relaxed"
                style={{ minHeight: 20 }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mb-0.5",
                  input.trim() && !loading
                    ? "text-white hover:opacity-90"
                    : "bg-slate-200 text-slate-400"
                )}
                style={input.trim() && !loading ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-300 text-center mt-1.5">
              Powered by RAG · Spring AI / FastAPI
            </p>
          </div>
        </div>
      )}

      {/* ── FAB button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          width: 52, height: 52,
          background: open
            ? "linear-gradient(135deg,#64748b,#475569)"
            : "linear-gradient(135deg,#6366f1,#4f46e5)",
          boxShadow: open
            ? "0 4px 16px rgba(100,116,139,0.4)"
            : "0 4px 16px rgba(99,102,241,0.45)",
        }}
      >
        {open ? (
          <X size={20} />
        ) : (
          <>
            <MessageCircle size={22} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
          </>
        )}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: scale(.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1)  translateY(0);     }
        }
      `}</style>
    </div>,
    document.body
  );
}
