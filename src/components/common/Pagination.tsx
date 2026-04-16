"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPage }: Props) {
  const [pageInput, setPageInput] = useState("");

  if (totalPages <= 1) return null;

  /* Smart page buttons */
  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const jump = () => {
    const n = parseInt(pageInput);
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      onPage(n);
      setPageInput("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Prev / page buttons / Next */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((n, i) =>
          n === "..." ? (
            <span key={`e-${i}`} className="w-8 text-center text-xs text-slate-400">…</span>
          ) : (
            <button
              key={n}
              onClick={() => onPage(n as number)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                n === page ? "text-white" : "text-slate-600 hover:bg-slate-100"
              )}
              style={n === page ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
            >
              {n}
            </button>
          )
        )}

        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Jump to page */}
      <div className="flex items-center gap-1.5 border-l border-slate-100 pl-2">
        <span className="text-xs text-slate-400">Đến trang</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && jump()}
          placeholder={String(page)}
          className="w-12 h-7 rounded-lg text-center text-xs border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-slate-400">/ {totalPages}</span>
      </div>
    </div>
  );
}
