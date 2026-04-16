"use client";

import { cn } from "@/lib/utils";
import type { RevenuePoint, Period } from "../types";

interface Props {
  data: Record<Period, RevenuePoint[]>;
  period: Period;
  onPeriod: (p: Period) => void;
}

const PERIOD_LABELS: Record<Period, string> = {
  "7d":  "7 ngày",
  "30d": "30 ngày",
  "90d": "3 tháng",
};

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)}M`;
  return `${(n / 1_000).toFixed(0)}K`;
}

export default function RevenueChart({ data, period, onPeriod }: Props) {
  const points  = data[period];
  const maxRev  = Math.max(...points.map((p) => p.revenue));
  const H       = 180; // chart height px
  const BAR_GAP = 100 / points.length;

  const totalRev    = points.reduce((s, p) => s + p.revenue, 0);
  const totalOrders = points.reduce((s, p) => s + p.orders, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Doanh thu</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {points[0]?.label} – {points[points.length - 1]?.label}
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                period === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-6 mb-5 pb-4 border-b border-slate-100">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {(totalRev / 1_000_000).toFixed(0)}
            <span className="text-sm font-normal text-slate-400 ml-1">triệu ₫</span>
          </p>
          <p className="text-xs text-slate-400">Tổng doanh thu</p>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {totalOrders}
            <span className="text-sm font-normal text-slate-400 ml-1">đơn</span>
          </p>
          <p className="text-xs text-slate-400">Tổng đơn hàng</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative" style={{ height: H + 28 }}>
        {/* Y-axis grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-slate-100"
            style={{ bottom: 28 + (pct / 100) * H }}
          >
            {pct > 0 && (
              <span className="absolute -top-3 -left-1 text-[10px] text-slate-300 translate-x-0">
                {fmt(maxRev * pct / 100)}
              </span>
            )}
          </div>
        ))}

        {/* Bars */}
        <div className="absolute inset-x-8 bottom-7 top-0 flex items-end gap-1">
          {points.map((pt, i) => {
            const heightPct = maxRev === 0 ? 0 : (pt.revenue / maxRev) * 100;
            const isLast    = i === points.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                    <p className="font-semibold">{fmt(pt.revenue)} ₫</p>
                    <p className="text-slate-400">{pt.orders} đơn</p>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-t-md transition-all duration-300 cursor-pointer group-hover:opacity-80"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: pt.revenue > 0 ? 4 : 0,
                    background: isLast
                      ? "linear-gradient(180deg,#6366f1,#4f46e5)"
                      : "linear-gradient(180deg,#a5b4fc,#c7d2fe)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute inset-x-8 bottom-0 flex">
          {points.map((pt, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-slate-400">{pt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(180deg,#6366f1,#4f46e5)" }} />
          <span className="text-xs text-slate-500">Kỳ hiện tại</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-indigo-200" />
          <span className="text-xs text-slate-500">Các kỳ trước</span>
        </div>
      </div>
    </div>
  );
}
