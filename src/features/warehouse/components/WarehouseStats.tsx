import { Warehouse as WarehouseIcon, LayoutGrid, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Warehouse } from "../types";

interface Props {
  warehouses: Warehouse[];
}

function usagePct(used: number, slots: number) {
  return slots === 0 ? 0 : Math.round((used / slots) * 100);
}

export default function WarehouseStats({ warehouses }: Props) {
  const totalArea  = warehouses.reduce((s, w) => s + w.totalArea, 0);
  const totalZones = warehouses.reduce((s, w) => s + w.zones.length, 0);
  const allZones   = warehouses.flatMap((w) => w.zones);
  const totalSlots = allZones.reduce((s, z) => s + z.slots, 0);
  const totalUsed  = allZones.reduce((s, z) => s + z.used, 0);
  const avgPct     = Math.round((totalUsed / totalSlots) * 100);
  const nearFull   = allZones.filter((z) => usagePct(z.used, z.slots) >= 90).length;

  const stats = [
    {
      label: "Tổng diện tích",
      value: `${totalArea.toLocaleString("vi-VN")} m²`,
      sub: `${warehouses.length} kho`,
      icon: WarehouseIcon,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Khu vực (kệ)",
      value: `${totalZones} kệ`,
      sub: `${totalSlots} vị trí`,
      icon: LayoutGrid,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Đang sử dụng",
      value: `${totalUsed} vị trí`,
      sub: `${avgPct}% công suất`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Cảnh báo",
      value: `${nearFull} khu`,
      sub: "Gần đầy (≥ 90%)",
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((k) => {
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
  );
}
