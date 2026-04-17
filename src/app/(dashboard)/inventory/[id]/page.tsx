"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, AlertTriangle, XCircle,
  MapPin, CalendarCheck, CalendarX2, Package,
  SlidersHorizontal, ArrowLeftRight, TrendingUp, TrendingDown, Repeat2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatus } from "@/features/inventory/types";
import type { InventoryLog, StockItem } from "@/features/inventory/types";
import { STOCK_ITEMS, MOCK_LOGS } from "@/features/inventory/data/mock";
import AdjustStockModal  from "@/features/inventory/components/AdjustStockModal";
import TransferStockModal from "@/features/inventory/components/TransferStockModal";

/* ── Config ── */
const STATUS_CFG = {
  ok:  { label: "Đủ hàng",  Icon: CheckCircle2,  cls: "text-emerald-700 bg-emerald-50 border-emerald-200", bar: "#10b981" },
  low: { label: "Sắp hết",  Icon: AlertTriangle, cls: "text-amber-700   bg-amber-50   border-amber-200",   bar: "#f59e0b" },
  out: { label: "Hết hàng", Icon: XCircle,       cls: "text-red-700     bg-red-50     border-red-200",     bar: "#ef4444" },
};

const LOG_CFG = {
  adjust_increase: { label: "Tăng tồn kho",  Icon: TrendingUp,  cls: "text-emerald-600 bg-emerald-50",  sign: "+" },
  adjust_decrease: { label: "Giảm tồn kho",  Icon: TrendingDown, cls: "text-red-600     bg-red-50",      sign: "−" },
  transfer:        { label: "Chuyển kho",     Icon: Repeat2,     cls: "text-indigo-600  bg-indigo-50",   sign: "↔" },
};

interface Props { params: Promise<{ id: string }> }

export default function InventoryDetailPage({ params }: Props) {
  const { id } = use(params);
  const router  = useRouter();

  const initial = STOCK_ITEMS.find((s) => s.id === id);
  if (!initial) notFound();

  const [item,         setItem]         = useState<StockItem>(initial);
  const [logs,         setLogs]         = useState<InventoryLog[]>(
    MOCK_LOGS.filter((l) => l.productId === id)
  );
  const [showAdjust,   setShowAdjust]   = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const addLog = (log: InventoryLog) => setLogs((prev) => [log, ...prev]);

  const st     = getStatus(item.current, item.min);
  const cfg    = STATUS_CFG[st];
  const StatusIcon = cfg.Icon;
  const pct    = item.min === 0 ? 100 : Math.min(100, Math.round((item.current / (item.min * 2)) * 100));

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm flex-shrink-0"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <button onClick={() => router.push("/inventory")} className="hover:text-indigo-600 transition-colors">
              Tồn kho
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-mono font-semibold text-slate-800">{item.id}</span>
          </nav>

          <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", cfg.cls)}>
            <StatusIcon size={11} />
            {cfg.label}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowAdjust(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal size={14} /> Điều chỉnh
          </button>
          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
          >
            <ArrowLeftRight size={14} /> Chuyển kho
          </button>
        </div>
      </div>

      {/* ── Body grid ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* ── Col trái (2/3) ── */}
        <div className="col-span-2 space-y-4">

          {/* Card: Thông tin tồn kho */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-mono text-xs font-bold text-indigo-500 mb-1">{item.id}</p>
                <h2 className="text-base font-bold text-slate-900">{item.name}</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Package size={18} />
              </div>
            </div>

            {/* Tồn kho + progress */}
            <div className="mb-5">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tồn kho hiện tại</p>
                  <p className={cn("text-3xl font-bold",
                    st === "out" ? "text-red-500" : st === "low" ? "text-amber-500" : "text-slate-900"
                  )}>
                    {item.current}
                    <span className="text-base font-normal text-slate-400 ml-1.5">{item.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-0.5">Tối thiểu</p>
                  <p className="text-sm font-semibold text-slate-600">{item.min} {item.unit}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: cfg.bar }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-400">0</span>
                <span className="text-[10px] text-slate-400">
                  {pct}% / ngưỡng tối thiểu {item.min * 2} {item.unit}
                </span>
              </div>
            </div>

            {/* Info grid */}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <dt className="text-[10px] text-slate-400 uppercase tracking-wide">Vị trí kho</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{item.warehouse}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Package size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <dt className="text-[10px] text-slate-400 uppercase tracking-wide">Đơn vị tính</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{item.unit}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarCheck size={14} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <dt className="text-[10px] text-slate-400 uppercase tracking-wide">Nhập gần nhất</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{item.lastIn}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarX2 size={14} className="text-rose-400 flex-shrink-0" />
                <div>
                  <dt className="text-[10px] text-slate-400 uppercase tracking-wide">Xuất gần nhất</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{item.lastOut}</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Card: Lịch sử biến động */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Lịch sử biến động</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                {logs.length} bản ghi
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="py-14 text-center text-slate-400">
                <Repeat2 size={30} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chưa có biến động nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/60 border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Thao tác</th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3 w-24">Số lượng</th>
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Lý do</th>
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Ghi chú</th>
                      <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 w-36">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {logs.map((log) => {
                      const lc = LOG_CFG[log.type];
                      const LogIcon = lc.Icon;
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", lc.cls)}>
                              <LogIcon size={11} />
                              {lc.label}
                            </span>
                            {log.type === "transfer" && (
                              <p className="text-[10px] text-slate-400 mt-1">
                                {log.fromWarehouse} → {log.toWarehouse}
                              </p>
                            )}
                            {log.type !== "transfer" && log.warehouse && (
                              <p className="text-[10px] text-slate-400 mt-1">{log.warehouse}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={cn("font-bold text-sm",
                              log.type === "adjust_increase" ? "text-emerald-600"
                              : log.type === "adjust_decrease" ? "text-red-500"
                              : "text-indigo-600"
                            )}>
                              {lc.sign}{log.qty}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">{log.reason}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate">
                            {log.note || "—"}
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-xs text-slate-600">{log.createdAt}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{log.createdBy}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Col phải (1/3) ── */}
        <div className="col-span-1 space-y-4">

          {/* Card: Tổng quan nhanh */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Tổng quan</h2>

            {/* Stats */}
            <div className="space-y-3">
              {[
                { label: "Tổng biến động",  value: logs.length,                             unit: "lần",  color: "text-indigo-600" },
                { label: "Lần tăng tồn",   value: logs.filter(l => l.type === "adjust_increase").length, unit: "lần", color: "text-emerald-600" },
                { label: "Lần giảm tồn",   value: logs.filter(l => l.type === "adjust_decrease").length, unit: "lần", color: "text-red-500" },
                { label: "Lần chuyển kho", value: logs.filter(l => l.type === "transfer").length,         unit: "lần", color: "text-amber-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-500">{s.label}</span>
                  <span className={cn("text-sm font-bold", s.color)}>
                    {s.value} <span className="text-xs font-normal text-slate-400">{s.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Hành động nhanh */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">Hành động nhanh</h2>

            <button
              onClick={() => setShowAdjust(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <SlidersHorizontal size={14} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-800">Điều chỉnh tồn kho</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Tăng / giảm số lượng</p>
              </div>
            </button>

            <button
              onClick={() => setShowTransfer(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <ArrowLeftRight size={14} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-800">Chuyển kho</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Di chuyển giữa các kho</p>
              </div>
            </button>

            {st !== "ok" && (
              <div className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-xl border text-left",
                st === "out"
                  ? "border-red-200 bg-red-50"
                  : "border-amber-200 bg-amber-50"
              )}>
                <AlertTriangle size={14} className={cn("flex-shrink-0 mt-0.5", st === "out" ? "text-red-500" : "text-amber-500")} />
                <p className={cn("text-xs leading-relaxed", st === "out" ? "text-red-700" : "text-amber-700")}>
                  {st === "out"
                    ? "Mặt hàng đã hết hàng. Cần nhập thêm ngay."
                    : `Tồn kho còn ${item.current} ${item.unit}, dưới mức tối thiểu ${item.min} ${item.unit}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdjust && (
        <AdjustStockModal
          items={STOCK_ITEMS}
          onClose={() => setShowAdjust(false)}
          onLog={(log) => { addLog(log); setShowAdjust(false); }}
        />
      )}
      {showTransfer && (
        <TransferStockModal
          items={STOCK_ITEMS}
          onClose={() => setShowTransfer(false)}
          onLog={(log) => { addLog(log); setShowTransfer(false); }}
        />
      )}
    </div>
  );
}
