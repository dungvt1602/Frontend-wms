import type { CategoryStat } from "../types";

interface Props {
  categories: CategoryStat[];
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
}

export default function CategoryBreakdown({ categories }: Props) {
  const total = categories.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">Phân tích theo danh mục</h2>
        <p className="text-xs text-slate-400 mt-0.5">Tỉ trọng doanh thu từng nhóm hàng</p>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
        {categories.map((c) => (
          <div
            key={c.name}
            className="h-full transition-all"
            style={{ width: `${c.percent}%`, background: c.color }}
            title={`${c.name}: ${c.percent}%`}
          />
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            {/* Color dot */}
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{c.name}</span>
                <span className="text-slate-400">{c.percent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${c.percent}%`, background: c.color }}
                />
              </div>
            </div>

            {/* Value */}
            <div className="text-right flex-shrink-0 w-24">
              <p className="text-xs font-semibold text-slate-800">{fmt(c.revenue)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500">Tổng cộng</span>
        <span className="text-sm font-bold text-slate-900">{fmt(total)}</span>
      </div>
    </div>
  );
}
