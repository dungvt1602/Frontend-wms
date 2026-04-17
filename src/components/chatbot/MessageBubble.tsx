"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./types";

/* markdown-lite: **bold** + whitespace-pre-line */
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

interface Props {
  message: Message;
}

export default function MessageBubble({ message: m }: Props) {
  const isBot = m.role === "assistant";

  return (
    <div className={cn("flex gap-2 items-end", isBot ? "flex-row" : "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5",
        isBot ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
      )}>
        {isBot ? <Bot size={13} /> : <User size={12} />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[76%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line",
          isBot
            ? "bg-slate-100 text-slate-800 rounded-bl-sm"
            : "text-white rounded-br-sm"
        )}
        style={!isBot ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
      >
        {renderContent(m.content)}
      </div>
    </div>
  );
}
