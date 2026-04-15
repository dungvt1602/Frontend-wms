"use client";

import { useState } from "react";
import {
  Warehouse, MapPin, User2, LayoutGrid, Package,
  Plus, Settings2, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Wrench,
  Thermometer, Zap, Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ══════════════ Mock data ══════════════ */
const warehouses = [
  {
    id: "KA",
    name: "Kho A",
    address: "18 Duy Tân, Cầu Giấy, Hà Nội",
    manager: "Nguyễn Văn An",
    phone: "0901 234 567",
    totalArea: 1200,
    status: "active",
    features: ["Điều hoà", "Điện dự phòng", "PCCC"],
    zones: [
      { id: "KA-K1", name: "Kệ 1", type: "Điện tử cao cấp",   slots: 80,  used: 48,  temp: "18–22°C" },
      { id: "KA-K2", name: "Kệ 2", type: "Linh kiện",         slots: 60,  used: 4,   temp: "20–25°C" },
      { id: "KA-K3", name: "Kệ 3", type: "Laptop & máy tính", slots: 50,  used: 48,  temp: "18–22°C" },
      { id: "KA-K4", name: "Kệ 4", type: "Thiết bị âm thanh", slots: 40,  used: 33,  temp: "20–25°C" },
      { id: "KA-K5", name: "Kệ 5", type: "Phụ kiện",          slots: 100, used: 62,  temp: "20–25°C" },
    ],
  },
  {
    id: "KB",
    name: "Kho B",
    address: "72 Lê Văn Lương, Thanh Xuân, Hà Nội",
    manager: "Trần Thị Bình",
    phone: "0912 345 678",
    totalArea: 950,
    status: "active",
    features: ["Điện dự phòng", "PCCC", "Camera 24/7"],
    zones: [
      { id: "KB-K1", name: "Kệ 1", type: "Sạc & cáp",         slots: 150, used: 0,   temp: "20–25°C" },
      { id: "KB-K2", name: "Kệ 2", type: "Hub & bộ chuyển",   slots: 120, used: 88,  temp: "20–25°C" },
      { id: "KB-K3", name: "Kệ 3", type: "Webcam & micro",    slots: 60,  used: 0,   temp: "20–25°C" },
      { id: "KB-K4", name: "Kệ 4", type: "Phụ kiện di động",  slots: 80,  used: 55,  temp: "20–25°C" },
      { id: "KB-K5", name: "Kệ 5", type: "Bàn phím & chuột",  slots: 200, used: 124, temp: "20–25°C" },
    ],
  },
  {
    id: "KC",
    name: "Kho C",
    address: "45 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
    manager: "Lê Minh Châu",
    phone: "0933 456 789",
    totalArea: 800,
    status: "maintenance",
    features: ["Điều hoà", "PCCC"],
    zones: [
      { id: "KC-K1", name: "Kệ 1", type: "Bộ nhớ & lưu trữ", slots: 100, used: 61,  temp: "18–22°C" },
      { id: "KC-K2", name: "Kệ 2", type: "SSD & RAM",         slots: 120, used: 61,  temp: "18–22°C" },
      { id: "KC-K3", name: "Kệ 3", type: "Ổ cứng ngoài",     slots: 80,  used: 40,  temp: "20–25°C" },
      { id: "KC-K4", name: "Kệ 4", type: "Linh kiện PC",      slots: 90,  used: 72,  temp: "20–25°C" },
    ],
  },
];

const featureIcons: Record<string, React.ReactNode> = {
  "Điều hoà":      <Thermometer size={11} />,
  "Điện dự phòng": <Zap size={11} />,
  "PCCC":          <Wind size={11} />,
  "Camera 24/7":   <Wind size={11} />,
};

const statusCfg = {
  active:      { label: "Đang hoạt động", cls: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  maintenance: { label: "Bảo trì",        cls: "text-amber-700   bg-amber-50   border-amber-200",   dot: "bg-amber-400"  },
  inactive:    { label: "Tạm ngừng",      cls: "text-slate-600   bg-slate-100  border-slate-200",   dot: "bg-slate-400"  },
};

function usagePct(used: number, slots: number) {
  return slots === 0 ? 0 : Math.round((used / slots) * 100);
}
function usageColor(pct: number) {
  if (pct >= 90) return "#ef4444";
  if (pct >= 70) return "#f59e0b";
  return "#6366f1";
}

const totalArea  = warehouses.reduce((s, w) => s + w.totalArea, 0);
const totalZones = warehouses.reduce((s, w) => s + w.zones.length, 0);
const allZones   = warehouses.flatMap((w) => w.zones);
const totalSlots = allZones.reduce((s, z) => s + z.slots, 0);
const totalUsed  = allZones.reduce((s, z) => s + z.used, 0);
const avgPct     = Math.round((totalUsed / totalSlots) * 100);
const nearFull   = allZones.filter((z) => usagePct(z.used, z.slots) >= 90).length;

/* ══════════════ Page ══════════════ */
export default function WarehousePage() {
  const [expanded, setExpanded] = useState<string | null>("KA");

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="space-y-5 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý kho bãi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {warehouses.length} kho · {totalZones} khu vực · {totalArea.toLocaleString()} m² tổng diện tích
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <Settings2 size={15} /> Cài đặt kho
          </button>
          <button
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
          >
            <Plus size={15} /> Thêm kho
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tổng diện tích", value: `${totalArea.toLocaleString()} m²`, sub: `${warehouses.length} kho`,             icon: Warehouse,      color: "text-indigo-600", bg: "bg-indigo-50"  },
          { label: "Khu vực (kệ)",   value: `${totalZones} kệ`,                 sub: `${totalSlots} vị trí`,                  icon: LayoutGrid,     color: "text-violet-600", bg: "bg-violet-50"  },
          { label: "Đang sử dụng",   value: `${totalUsed} vị trí`,              sub: `${avgPct}% công suất`,                  icon: Package,        color: "text-blue-600",   bg: "bg-blue-50"    },
          { label: "Cảnh báo",       value: `${nearFull} khu`,                  sub: "Gần đầy (≥ 90%)",                       icon: AlertTriangle,  color: "text-amber-600",  bg: "bg-amber-50"   },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", k.bg)}>
                <Icon size={20} className={k.color} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none">{k.value}</p>
                <p className="text-xs text-slate-400 mt-1">{k.label}</p>
                <p className="text-[10px] text-slate-400">{k.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordion warehouse cards */}
      <div className="space-y-3">
        {warehouses.map((w) => {
          const st     = statusCfg[w.status as keyof typeof statusCfg];
          const wUsed  = w.zones.reduce((s, z) => s + z.used, 0);
          const wSlots = w.zones.reduce((s, z) => s + z.slots, 0);
          const wPct   = usagePct(wUsed, wSlots);
          const isOpen = expanded === w.id;

          return (
            <div key={w.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

              {/* Card header */}
              <button
                onClick={() => toggle(w.id)}
                className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                     style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
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
                    {wUsed}/{wSlots} vị trí · {w.totalArea.toLocaleString()} m²
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
                        const pct  = usagePct(z.used, z.slots);
                        const col  = usageColor(pct);
                        const zSt  =
                          z.used === 0 ? { label: "Trống",    cls: "text-slate-500 bg-slate-100 border-slate-200",      Icon: LayoutGrid    } :
                          pct >= 90    ? { label: "Gần đầy",  cls: "text-red-700 bg-red-50 border-red-200",             Icon: AlertTriangle } :
                          pct >= 70    ? { label: "Khá đầy",  cls: "text-amber-700 bg-amber-50 border-amber-200",       Icon: AlertTriangle } :
                                         { label: "Còn chỗ",  cls: "text-emerald-700 bg-emerald-50 border-emerald-200", Icon: CheckCircle2  };
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

                  {/* Zone footer */}
                  <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
                    <p className="text-xs text-slate-400">
                      {w.zones.length} khu vực
                      · <span className="text-slate-600">{w.zones.filter((z) => z.used === 0).length}</span> trống
                      · <span className="text-amber-600">{w.zones.filter((z) => usagePct(z.used, z.slots) >= 90).length}</span> gần đầy
                    </p>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                      <Plus size={12} /> Thêm khu vực
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Maintenance banner */}
      {warehouses.some((w) => w.status === "maintenance") && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <Wrench size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {warehouses.filter((w) => w.status === "maintenance").map((w) => w.name).join(", ")} đang trong giai đoạn bảo trì
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Các hoạt động nhập xuất kho tại khu vực này tạm thời bị gián đoạn. Dự kiến hoàn thành: 20/04/2026.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
