import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatus } from "../types";
import type { StockItem } from "../types";

interface Props {
  items: StockItem[];
}

export default function InventoryStats({ items }: Props) {
  const okCount  = items.filter((p) => getStatus(p.current, p.min) === "ok").length;
  const lowCount = items.filter((p) => getStatus(p.current, p.min) === "low").length;
  const outCount = items.filter((p) => getStatus(p.current, p.min) === "out").length;

  const stats = [
    { label: "Đủ hàng",  value: okCount,  icon: CheckCircle2,  bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    { label: "Sắp hết",  value: lowCount, icon: AlertTriangle, bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200"   },
    { label: "Hết hàng", value: outCount, icon: XCircle,       bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200"     },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className={cn("flex items-center gap-3 bg-white rounded-xl p-4 border", s.border)}>
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", s.bg)}>
              <Icon className={cn("h-[18px] w-[18px]", s.text)} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">
                {s.value} <span className="text-sm font-normal text-slate-400">mặt hàng</span>
              </p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
