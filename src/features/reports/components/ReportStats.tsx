import type { ElementType } from "react";
import { TrendingUp, ShoppingCart, PackageCheck, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  sub: string;
  change: number; // % so với kỳ trước, dương = tăng
  icon: ElementType;
  color: string;
  bg: string;
}

interface Props {
  totalRevenue: number;
  totalOrders: number;
  totalExported: number;
  avgOrderValue: number;
  period: string;
}

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN");
}

export default function ReportStats({ totalRevenue, totalOrders, totalExported, avgOrderValue, period }: Props) {
  const stats: Stat[] = [
    {
      label: "Tổng doanh thu",
      value: `${fmt(totalRevenue)} ₫`,
      sub: `So với ${period} trước`,
      change: 12.4,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Đơn hàng",
      value: totalOrders.toLocaleString("vi-VN"),
      sub: `So với ${period} trước`,
      change: 8.1,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Sản phẩm xuất kho",
      value: totalExported.toLocaleString("vi-VN"),
      sub: `So với ${period} trước`,
      change: -3.2,
      icon: PackageCheck,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Giá trị TB / đơn",
      value: `${fmt(avgOrderValue)} ₫`,
      sub: `So với ${period} trước`,
      change: 5.7,
      icon: BarChart3,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        const up   = s.change >= 0;
        return (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                <Icon size={18} className={s.color} />
              </div>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                up ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
              )}>
                {up ? "+" : ""}{s.change}%
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5">{s.label}</p>
            <p className="text-[10px] text-slate-300 mt-0.5">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
