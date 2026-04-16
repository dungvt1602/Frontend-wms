"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, User2, ChevronDown, ChevronUp, Pencil,
  CheckCircle2, AlertTriangle, LayoutGrid,
  Thermometer, Zap, Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Warehouse } from "../types";

/* ── helpers ── */
function usagePct(used: number, slots: number) {
  return slots === 0 ? 0 : Math.round((used / slots) * 100);
}
function usageColor(pct: number) {
  if (pct >= 90) return "#ef4444";
  if (pct >= 70) return "#f59e0b";
  return "#6366f1";
}

const statusCfg = {
  active:      { label: "Đang hoạt động", cls: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  maintenance: { label: "Bảo trì",        cls: "text-amber-700   bg-amber-50   border-amber-200",   dot: "bg-amber-400"  },
  inactive:    { label: "Tạm ngừng",      cls: "text-slate-600   bg-slate-100  border-slate-200",   dot: "bg-slate-400"  },
};

const featureIcons: Record<string, React.ReactNode> = {
  "Điều hoà":      <Thermometer size={11} />,
  "Điện dự phòng": <Zap size={11} />,
  "PCCC":          <Wind size={11} />,
  "Camera 24/7":   <Wind size={11} />,
};

interface Props {
  warehouse: Warehouse;
  defaultOpen?: boolean;
}

export default function WarehouseCard({ warehouse: w, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const router = useRouter();

  const st     = statusCfg[w.status];
  const wUsed  = w.zones.reduce((s, z) => s + z.used, 0);
  const wSlots = w.zones.reduce((s, z) => s + z.slots, 0);
  const wPct   = usagePct(wUsed, wSlots);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
      >
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
        >
          {w.name.replace("Kho ", "")}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">{w.name}</span>
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border", st.cls)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
              {st.label}
            </span>
            {w.features.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {featureIcons[f]} {f}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={11} /> {w.address}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <User2 size={11} /> {w.manager} · {w.phone}
            </span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="hidden sm:block w-44 flex-shrink-0">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Công suất</span>
            <span className="font-semibold" style={{ color: usageColor(wPct) }}>{wPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full transition-all"
                 style={{ width: `${wPct}%`, background: usageColor(wPct) }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {wUsed}/{wSlots} vị trí · {w.totalArea.toLocaleString("vi-VN")} m²
          </p>
        </div>

        {/* Chevron */}
        <div className="text-slate-400 flex-shrink-0 ml-2">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Zone table */}
      {isOpen && (
        <div className="border-t border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="text-left text-xs font-semibold text-slate-400 px-6 py-2.5 w-[80px]">Khu vực</th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5">Loại hàng lưu trữ</th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5">Nhiệt độ</th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5 w-[260px]">Công suất sử dụng</th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5">Tình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {w.zones.map((z) => {
                const pct = usagePct(z.used, z.slots);
                const col = usageColor(pct);
                const zSt =
                  z.used === 0 ? { label: "Trống",   cls: "text-slate-500 bg-slate-100 border-slate-200",      Icon: LayoutGrid    } :
                  pct >= 90    ? { label: "Gần đầy", cls: "text-red-700 bg-red-50 border-red-200",             Icon: AlertTriangle } :
                  pct >= 70    ? { label: "Khá đầy", cls: "text-amber-700 bg-amber-50 border-amber-200",       Icon: AlertTriangle } :
                                 { label: "Còn chỗ", cls: "text-emerald-700 bg-emerald-50 border-emerald-200", Icon: CheckCircle2  };
                return (
                  <tr key={z.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs font-bold text-indigo-600">{z.name}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{z.type}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Thermometer size={11} className="text-blue-400" /> {z.temp}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                               style={{ width: `${pct}%`, background: col }} />
                        </div>
                        <span className="text-xs font-semibold w-9 text-right shrink-0" style={{ color: col }}>
                          {pct}%
                        </span>
                        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                          {z.used}/{z.slots}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", zSt.cls)}>
                        <zSt.Icon size={11} />
                        {zSt.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
            <p className="text-xs text-slate-400">
              {w.zones.length} khu vực
              · <span className="text-slate-600">{w.zones.filter((z) => z.used === 0).length}</span> trống
              · <span className="text-amber-600">{w.zones.filter((z) => usagePct(z.used, z.slots) >= 90).length}</span> gần đầy
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/warehouse/${w.id}`); }}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Pencil size={12} /> Chỉnh sửa kho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
