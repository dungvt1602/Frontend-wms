import { Warehouse, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockByWarehouse } from "../types";

interface Props {
  stock: StockByWarehouse[];
}

export default function ProductStockInfo({ stock }: Props) {
  const totalStock = stock.reduce((s, w) => s + w.current, 0);
  const lowWarehouses = stock.filter((w) => w.current <= w.min);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Tồn kho</h2>
        <span className="text-2xl font-bold text-slate-900">
          {totalStock}
          <span className="text-sm font-normal text-slate-400 ml-1">đơn vị</span>
        </span>
      </div>

      {/* Cảnh báo */}
      {lowWarehouses.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            {lowWarehouses.map((w) => w.warehouse).join(", ")} dưới mức tối thiểu
          </p>
        </div>
      )}

      {/* Từng kho */}
      <div className="space-y-4">
        {stock.map((w) => {
          const pct    = Math.min(100, Math.round((w.current / w.capacity) * 100));
          const isLow  = w.current <= w.min;
          const isOut  = w.current === 0;
          const color  = isOut ? "#ef4444" : isLow ? "#f59e0b" : "#6366f1";

          return (
            <div key={w.warehouse}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Warehouse size={13} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">{w.warehouse}</span>
                  {isLow && !isOut && (
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                      Sắp hết
                    </span>
                  )}
                  {isOut && (
                    <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200">
                      Hết hàng
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={cn("text-sm font-bold", isOut ? "text-red-500" : isLow ? "text-amber-500" : "text-slate-800")}>
                    {w.current}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ {w.capacity}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>

              {/* Min marker */}
              <p className="text-[10px] text-slate-400 mt-1">Tối thiểu: {w.min} đơn vị</p>
            </div>
          );
        })}
      </div>

      {/* Footer tổng */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Tổng sức chứa</span>
          <span className="font-semibold text-slate-700">
            {stock.reduce((s, w) => s + w.capacity, 0)} đơn vị
          </span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">Tỷ lệ lấp đầy</span>
          <span className="font-semibold text-indigo-600">
            {Math.round((totalStock / stock.reduce((s, w) => s + w.capacity, 0)) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
