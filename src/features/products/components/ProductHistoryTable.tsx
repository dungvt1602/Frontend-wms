import { PackageCheck, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductHistory } from "../types";

interface Props {
  history: ProductHistory[];
}

export default function ProductHistoryTable({ history }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">Lịch sử nhập / xuất</h2>
        <p className="text-xs text-slate-400 mt-0.5">{history.length} giao dịch gần nhất</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Ngày</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Loại</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Mã đơn</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Đối tác</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Kho</th>
              <th className="text-right text-xs font-semibold text-slate-500 px-6 py-3">Số lượng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-3.5 text-xs text-slate-500 whitespace-nowrap">{h.date}</td>
                <td className="px-6 py-3.5">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                    h.type === "import"
                      ? "text-indigo-700 bg-indigo-50 border-indigo-200"
                      : "text-orange-700 bg-orange-50 border-orange-200"
                  )}>
                    {h.type === "import"
                      ? <PackageCheck size={11} />
                      : <PackageOpen size={11} />}
                    {h.type === "import" ? "Nhập kho" : "Xuất kho"}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs font-bold text-indigo-600">{h.orderId}</span>
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-700 whitespace-nowrap">{h.partner}</td>
                <td className="px-6 py-3.5 text-xs text-slate-500">{h.warehouse}</td>
                <td className="px-6 py-3.5 text-right">
                  <span className={cn(
                    "text-sm font-bold",
                    h.type === "import" ? "text-indigo-600" : "text-orange-500"
                  )}>
                    {h.type === "import" ? "+" : "-"}{h.qty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
