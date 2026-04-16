"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  status: "active" | "inactive";
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}

export default function ProductDetailHeader({ id, name, status, saving, saved, onSave }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between">
      {/* Breadcrumb + title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <button
            onClick={() => router.push("/products")}
            className="hover:text-indigo-600 transition-colors"
          >
            Sản phẩm
          </button>
          <ChevronRight size={12} />
          <span className="text-slate-500 font-medium">{id}</span>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">{name}</h1>
          <span className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
            status === "active"
              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
              : "text-slate-500 bg-slate-100 border-slate-200"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full",
              status === "active" ? "bg-emerald-500" : "bg-slate-400")} />
            {status === "active" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/products")}
          className="h-9 px-4 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
        >
          Huỷ
        </button>
        <button
          onClick={onSave}
          disabled={saving || saved}
          className={cn(
            "h-9 px-4 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all",
            saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60"
          )}
          style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" } : {}}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Đang lưu...</>
          ) : saved ? (
            <><Check size={14} /> Đã lưu!</>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
}
