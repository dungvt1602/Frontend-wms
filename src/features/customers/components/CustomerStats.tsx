import { Users, UserCheck, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "../types";

interface Props {
  customers: Customer[];
}

function fmtMoney(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN");
}

export default function CustomerStats({ customers }: Props) {
  const total      = customers.length;
  const active     = customers.filter((c) => c.status === "active").length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalDebt  = customers.reduce((sum, c) => sum + c.debtAmount, 0);

  const stats = [
    {
      label: "Tổng khách hàng",
      value: `${total}`,
      sub: "khách hàng",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Đang hoạt động",
      value: `${active}`,
      sub: "khách hàng",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Tổng doanh thu",
      value: fmtMoney(totalSpent),
      sub: "₫ doanh thu tích luỹ",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Tổng công nợ",
      value: fmtMoney(totalDebt),
      sub: "₫ chưa thanh toán",
      icon: Wallet,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                s.bg
              )}
            >
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
