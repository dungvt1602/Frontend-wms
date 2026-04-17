"use client";

import { type RefObject } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  input: string;
  loading: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export default function ChatInput({ input, loading, inputRef, onChange, onSend, onKeyDown }: Props) {
  const canSend = !!input.trim() && !loading;

  return (
    <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex-shrink-0">
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nhập câu hỏi... (Enter để gửi)"
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none resize-none max-h-24 leading-relaxed"
          style={{ minHeight: 20 }}
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mb-0.5",
            canSend ? "text-white hover:opacity-90" : "bg-slate-200 text-slate-400"
          )}
          style={canSend ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        </button>
      </div>
      <p className="text-[10px] text-slate-300 text-center mt-1.5">
        Powered by RAG · Spring AI / FastAPI
      </p>
    </div>
  );
}
