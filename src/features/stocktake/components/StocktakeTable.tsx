"use client";

import { Eye, ClipboardEdit, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stocktake, StocktakeStatus } from "../types";

interface StocktakeTableProps {
  items: Stocktake[];
  onView: (id: string) => void;
}

interface BadgeConfig {
  label: string;
  dot: string;
  cls: string;
}

const STATUS_CFG: Record<StocktakeStatus, BadgeConfig> = {
  draft:            { label: "Nháp",       dot: "bg-slate-400",  cls: "bg-slate-100 text-slate-600 border-slate-200"  },
  counting:         { label: "Đang kiểm",  dot: "bg-blue-500 animate-pulse", cls: "bg-blue-50 text-blue-700 border-blue-200"   },
  pending_approval: { label: "Chờ duyệt",  dot: "bg-amber-500",  cls: "bg-amber-50 text-amber-700 border-amber-200"   },
  completed:        { label: "Hoàn tất",   dot: "bg-green-500",  cls: "bg-green-50 text-green-700 border-green-200"   },
  cancelled:        { label: "Đã hủy",     dot: "bg-red-400",    cls: "bg-red-50 text-red-600 border-red-200"         },
};

function StatusBadge({ status }: { status: StocktakeStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      cfg.cls
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function ProgressCell({ stocktake }: { stocktake: Stocktake }) {
  const total   = stocktake.items.length;
  const counted = stocktake.items.filter((i) => i.actualQty !== null).length;
  const pct     = total === 0 ? 0 : Math.round((counted / total) * 100);
  const color   = pct === 100 ? "bg-green-500" : pct > 50 ? "bg-blue-500" : "bg-indigo-400";

  return (
    <div className="min-w-[130px] space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600 font-medium">{counted}/{total} mặt hàng</span>
        <span className="text-xs text-slate-400">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)}
             style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">
      {initials}
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const COLS = ["Mã phiên", "Kho", "Lịch kiểm", "Phụ trách", "Tiến độ", "Trạng thái", "Thao tác"];

export default function StocktakeTable({ items, onView }: StocktakeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {COLS.map((col) => (
              <th key={col}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap bg-slate-50/80 first:rounded-tl-2xl last:rounded-tr-2xl">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ClipboardEdit size={32} className="opacity-30" />
                  <p className="text-sm">Không có phiên kiểm kê nào</p>
                </div>
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => onView(item.id)}
                className={cn(
                  "group border-b border-slate-50 cursor-pointer transition-all duration-150",
                  "hover:bg-indigo-50/40 hover:shadow-[inset_3px_0_0_#6366f1]",
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                )}
              >
                {/* Mã phiên */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="font-semibold text-indigo-600 group-hover:text-indigo-700">
                    {item.code}
                  </span>
                </td>

                {/* Kho */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{item.warehouseName}</span>
                  </div>
                </td>

                {/* Lịch kiểm */}
                <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                  {formatDate(item.scheduledDate)}
                </td>

                {/* Phụ trách */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <AvatarInitials name={item.assignedTo} />
                    <span className="text-slate-700">{item.assignedTo}</span>
                  </div>
                </td>

                {/* Tiến độ */}
                <td className="px-5 py-4">
                  <ProgressCell stocktake={item} />
                </td>

                {/* Trạng thái */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>

                {/* Thao tác */}
                <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onView(item.id)}
                      title="Xem chi tiết"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                    {(item.status === "draft" || item.status === "counting") && (
                      <button
                        onClick={() => onView(item.id)}
                        title="Nhập liệu"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
                      >
                        <ClipboardEdit size={13} />
                        Nhập liệu
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
