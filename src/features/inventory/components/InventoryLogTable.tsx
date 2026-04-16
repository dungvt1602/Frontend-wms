"use client";

import { useState } from "react";
import { Plus, Minus, ArrowLeftRight, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import type { InventoryLog } from "../types";

const PAGE_SIZE = 8;

interface Props {
  logs: InventoryLog[];
}

const TYPE_CFG = {
  adjust_increase: {
    label: "Tăng tồn kho",
    icon: Plus,
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
    qtyColor: "text-emerald-600",
    prefix: "+",
  },
  adjust_decrease: {
    label: "Giảm tồn kho",
    icon: Minus,
    cls: "text-red-600 bg-red-50 border-red-200",
    qtyColor: "text-red-500",
    prefix: "−",
  },
  transfer: {
    label: "Chuyển kho",
    icon: ArrowLeftRight,
    cls: "text-indigo-700 bg-indigo-50 border-indigo-200",
    qtyColor: "text-indigo-600",
    prefix: "⇄",
  },
};

export default function InventoryLogTable({ logs }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const paginated  = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <PackageOpen size={36} className="opacity-30 mb-3" />
          <p className="text-sm">Chưa có lịch sử điều chỉnh nào</p>
          <p className="text-xs mt-1 text-slate-300">Thực hiện điều chỉnh hoặc chuyển kho để ghi log</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Thời gian</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Loại</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Sản phẩm</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Chi tiết kho</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Lý do</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Ghi chú</th>
              <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3.5">Số lượng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Người thực hiện</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((log) => {
              const cfg  = TYPE_CFG[log.type];
              const Icon = cfg.icon;
              return (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{log.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap",
                      cfg.cls
                    )}>
                      <Icon size={11} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800 whitespace-nowrap text-xs">{log.productName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.productId}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {log.type === "transfer" ? (
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-slate-700">{log.fromWarehouse}</span>
                        <ArrowLeftRight size={10} className="text-slate-400" />
                        <span className="font-medium text-slate-700">{log.toWarehouse}</span>
                      </span>
                    ) : (
                      log.warehouse
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{log.reason}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 max-w-[160px] truncate">
                    {log.note || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={cn("text-sm font-bold", cfg.qtyColor)}>
                      {cfg.prefix}{log.qty}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                           style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                        {log.createdBy.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-600 whitespace-nowrap">{log.createdBy}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, logs.length)}
            </span>{" "}
            / <span className="font-medium text-slate-700">{logs.length}</span> bản ghi
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      )}
    </div>
  );
}
