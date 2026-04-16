import { ShoppingCart, PackageCheck, PackageOpen, Truck, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "../types";

interface Props {
  orders: Order[];
}

export default function OrderStats({ orders }: Props) {
  const stats = [
    { label: "Tổng đơn hàng", value: orders.length,                                          icon: ShoppingCart,  color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-slate-200"   },
    { label: "Đơn nhập kho",  value: orders.filter((o) => o.type === "import").length,        icon: PackageCheck,  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200"    },
    { label: "Đơn xuất kho",  value: orders.filter((o) => o.type === "export").length,        icon: PackageOpen,   color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200"  },
    { label: "Đang giao",     value: orders.filter((o) => o.status === "shipping").length,    icon: Truck,         color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200"   },
    { label: "Hoàn thành",    value: orders.filter((o) => o.status === "completed").length,   icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { label: "Đã huỷ",        value: orders.filter((o) => o.status === "cancelled").length,   icon: XCircle,       color: "text-red-500",     bg: "bg-red-50",     border: "border-red-200"     },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className={cn("bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3", s.border)}>
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
              <Icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
