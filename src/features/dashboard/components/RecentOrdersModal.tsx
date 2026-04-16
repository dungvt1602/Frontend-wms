"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, XCircle, Clock, Loader2, Package } from "lucide-react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 6;

const statusMap: Record<string, { label: string; icon: ElementType; cls: string }> = {
  completed: { label: "Hoàn thành", icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  shipping:  { label: "Đang giao",  icon: Loader2,      cls: "text-blue-600   bg-blue-50   border-blue-200"     },
  pending:   { label: "Chờ xử lý", icon: Clock,        cls: "text-amber-600  bg-amber-50  border-amber-200"    },
  cancelled: { label: "Đã huỷ",    icon: XCircle,      cls: "text-red-600    bg-red-50    border-red-200"      },
};

export interface DashboardOrder {
  id: string;
  product: string;
  qty: number;
  warehouse: string;
  status: string;
  time: string;
}

interface Props {
  orders: DashboardOrder[];
  onClose: () => void;
}

export default function RecentOrdersModal({ orders, onClose }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginated  = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.4)" }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-3xl overflow-hidden"
        style={{ animation: "modalIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tất cả đơn hàng</h2>
            <p className="text-xs text-slate-400 mt-0.5">{orders.length} đơn hàng gần đây</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Mã đơn", "Sản phẩm", "SL", "Kho", "Trạng thái", "Giờ"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-slate-400">
                    <Package size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Không có đơn hàng nào</p>
                  </td>
                </tr>
              ) : paginated.map((o) => {
                const s = statusMap[o.status];
                const StatusIcon = s.icon;
                return (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-indigo-600">{o.id}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium whitespace-nowrap">{o.product}</td>
                    <td className="px-5 py-3.5 text-slate-600">{o.qty}</td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{o.warehouse}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap",
                        s.cls
                      )}>
                        <StatusIcon size={11} className={o.status === "shipping" ? "animate-spin" : ""} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{o.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)}
            </span>{" "}
            / <span className="font-medium text-slate-700">{orders.length}</span> đơn hàng
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>,
    document.body
  );
}
