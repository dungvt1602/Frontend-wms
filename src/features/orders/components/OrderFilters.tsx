import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types";

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all",        label: "Tất cả"     },
  { value: "pending",    label: "Chờ xử lý"  },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping",   label: "Đang giao"  },
  { value: "completed",  label: "Hoàn thành" },
  { value: "cancelled",  label: "Đã huỷ"    },
];

interface Props {
  search: string;
  typeF: string;
  statusF: string;
  paymentF: string;
  onSearch: (v: string) => void;
  onType: (v: string) => void;
  onStatus: (v: string) => void;
  onPayment: (v: string) => void;
}

export default function OrderFilters({ search, typeF, statusF, paymentF, onSearch, onType, onStatus, onPayment }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách / nhà cung cấp, SĐT..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Loại đơn */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { value: "all",    label: "Tất cả"    },
            { value: "import", label: "Nhập kho"  },
            { value: "export", label: "Xuất kho"  },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => onType(t.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                typeF === t.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Payment filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <select
            value={paymentF}
            onChange={(e) => onPayment(e.target.value)}
            className="h-9 pl-8 pr-6 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-600 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
          >
            <option value="all">Tất cả thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="partial">Thanh toán 1 phần</option>
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onStatus(t.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              statusF === t.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
