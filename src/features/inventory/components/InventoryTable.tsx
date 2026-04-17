import {
  ArrowUpDown, PackageOpen, CheckCircle2,
  AlertTriangle, XCircle, Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/common/Pagination";
import { cn } from "@/lib/utils";
import { getStatus } from "../types";
import type { StockItem } from "../types";

const PAGE_SIZE = 8;

const statusConfig = {
  ok:  { label: "Đủ hàng",  icon: CheckCircle2,  cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  low: { label: "Sắp hết",  icon: AlertTriangle, cls: "text-amber-700   bg-amber-50   border-amber-200"   },
  out: { label: "Hết hàng", icon: XCircle,       cls: "text-red-700     bg-red-50     border-red-200"     },
};

interface Props {
  items: StockItem[];       // already filtered + sorted
  total: number;            // total filtered count (for pagination label)
  page: number;
  sortDir: "asc" | "desc" | null;
  onSort: () => void;
  onPage: (p: number) => void;
}

export default function InventoryTable({ items, total, page, sortDir, onSort, onPage }: Props) {
  const router     = useRouter();
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated  = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 w-[90px]">Mã hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Tên sản phẩm</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Vị trí kho</th>
              <th
                className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 cursor-pointer select-none"
                onClick={onSort}
              >
                <span className="flex items-center gap-1">
                  Tồn kho
                  <ArrowUpDown size={13} className={cn(sortDir ? "text-indigo-500" : "text-slate-300")} />
                </span>
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Tối thiểu</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Nhập gần nhất</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Xuất gần nhất</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 w-[50px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-slate-400">
                  <PackageOpen size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Không tìm thấy dữ liệu tồn kho</p>
                </td>
              </tr>
            ) : paginated.map((p) => {
              const st   = getStatus(p.current, p.min);
              const s    = statusConfig[st];
              const Icon = s.icon;
              const pct  = Math.min(100, Math.round((p.current / (p.min * 2)) * 100));
              return (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => router.push(`/inventory/${p.id}`)}>
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">{p.id}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">{p.name}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.warehouse}</td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-1.5">
                      <span className={cn("font-bold text-sm",
                        st === "out" ? "text-red-500" : st === "low" ? "text-amber-500" : "text-slate-800")}>
                        {p.current} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                             style={{
                               width: `${pct}%`,
                               background: st === "out" ? "#ef4444" : st === "low" ? "#f59e0b" : "#10b981",
                             }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{p.min} {p.unit}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.lastIn}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.lastOut}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", s.cls)}>
                      <Icon size={11} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => router.push(`/inventory/${p.id}`)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
            </span>{" "}
            / <span className="font-medium text-slate-700">{total}</span> mặt hàng
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
}
