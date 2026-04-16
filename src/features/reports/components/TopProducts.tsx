import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopProduct } from "../types";

interface Props {
  products: TopProduct[];
}

const categoryColors: Record<string, string> = {
  "Điện tử":  "bg-blue-50 text-blue-700",
  "Phụ kiện": "bg-purple-50 text-purple-700",
  "Linh kiện":"bg-orange-50 text-orange-700",
};

const trendIcon = {
  up:     { icon: TrendingUp,   cls: "text-emerald-500" },
  down:   { icon: TrendingDown, cls: "text-red-500"     },
  stable: { icon: Minus,        cls: "text-slate-400"   },
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  return n.toLocaleString("vi-VN");
}

const rankStyle = [
  "bg-amber-400 text-white",   // 1
  "bg-slate-400 text-white",   // 2
  "bg-orange-400 text-white",  // 3
];

export default function TopProducts({ products }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">Top sản phẩm bán chạy</h2>
        <p className="text-xs text-slate-400 mt-0.5">Xếp hạng theo số lượng xuất kho</p>
      </div>

      <div className="space-y-2">
        {products.map((p) => {
          const trend = trendIcon[p.trend];
          const TrendIcon = trend.icon;
          const maxSold = products[0].sold;
          const barPct  = Math.round((p.sold / maxSold) * 100);

          return (
            <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors">
              {/* Rank badge */}
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                rankStyle[p.rank - 1] ?? "bg-slate-100 text-slate-500"
              )}>
                {p.rank}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0", categoryColors[p.category])}>
                    {p.category}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden w-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barPct}%`,
                      background: "linear-gradient(90deg,#6366f1,#818cf8)",
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <TrendIcon size={12} className={trend.cls} />
                  <span className="text-sm font-bold text-slate-900">{p.sold}</span>
                  <span className="text-xs text-slate-400">cái</span>
                </div>
                <p className="text-xs text-slate-400">{fmt(p.revenue)} ₫</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
