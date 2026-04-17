"use client";

import { MessageCircle, X } from "lucide-react";

interface Props {
  open: boolean;
  unread: number;
  onClick: () => void;
}

export default function FABButton({ open, unread, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95"
      style={{
        width: 52,
        height: 52,
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
          {/* online dot */}
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
        </>
      )}

      {/* unread badge */}
      {!open && unread > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
          {unread}
        </span>
      )}
    </button>
  );
}
