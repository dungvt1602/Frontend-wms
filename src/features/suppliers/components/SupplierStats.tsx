import { Building2, CheckCircle2, AlertCircle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Supplier } from "../types";

interface Props {
  suppliers: Supplier[];
}

function fmtDebt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN");
}

export default function SupplierStats({ suppliers }: Props) {
  const total      = suppliers.length;
  const active     = suppliers.filter((s) => s.status === "active").length;
  const inactive   = suppliers.filter((s) => s.status === "inactive").length;
  const totalDebt  = suppliers.reduce((sum, s) => sum + s.debtAmount, 0);

  const stats = [
    { label: "Tổng nhà cung cấp", value: `${total}`,             sub: "đối tác",         icon: Building2,    color: "text-indigo-600", bg: "bg-indigo-50"  },
    { label: "Đang hợp tác",      value: `${active}`,            sub: "nhà cung cấp",    icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50" },
    { label: "Tạm ngừng",         value: `${inactive}`,          sub: "nhà cung cấp",    icon: AlertCircle,  color: "text-amber-600",  bg: "bg-amber-50"   },
    { label: "Tổng công nợ",      value: `${fmtDebt(totalDebt)}`, sub: "₫ cần thanh toán", icon: Wallet,      color: "text-red-500",    bg: "bg-red-50"     },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
              <Icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              <p className="text-[10px] text-slate-300">{s.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
