import type { CategoryStat } from "../types";

interface Props {
  categories: CategoryStat[];
  totalRevenue: number;
}

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN");
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start    = polarToXY(cx, cy, r, startDeg);
  const end      = polarToXY(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function DonutChart({ categories, totalRevenue }: Props) {
  const CX = 90, CY = 90, R_OUTER = 72, R_INNER = 46;
  const GAP_DEG = 3;

  let cursor = 0;
  const segments = categories.map((c) => {
    const span  = (c.percent / 100) * 360 - GAP_DEG;
    const start = cursor + GAP_DEG / 2;
    const end   = start + span;
    cursor     += (c.percent / 100) * 360;
    return { ...c, start, end };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">Phân bổ doanh thu</h2>
        <p className="text-xs text-slate-400 mt-0.5">Tỉ trọng theo danh mục hàng</p>
      </div>

      {/* SVG — canh giữa */}
      <div className="flex justify-center mb-5">
        <svg width={180} height={180} viewBox="0 0 180 180">
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#f1f5f9" strokeWidth={R_OUTER - R_INNER} />
          {segments.map((s) => (
            <path
              key={s.name}
              d={arcPath(CX, CY, (R_OUTER + R_INNER) / 2, s.start, s.end)}
              fill="none"
              stroke={s.color}
              strokeWidth={R_OUTER - R_INNER}
              strokeLinecap="butt"
              className="transition-all duration-300 hover:opacity-75 cursor-pointer"
            />
          ))}
          {/* Center */}
          <text x={CX} y={CY - 8}  textAnchor="middle" fill="#0f172a" fontSize={14} fontWeight={700}>{fmt(totalRevenue)}</text>
          <text x={CX} y={CY + 8}  textAnchor="middle" fill="#94a3b8" fontSize={10}>₫</text>
          <text x={CX} y={CY + 22} textAnchor="middle" fill="#94a3b8" fontSize={9}>Tổng doanh thu</text>
        </svg>
      </div>

      {/* Legend — dạng hàng ngang, mỗi danh mục 1 dòng */}
      <div className="space-y-2.5">
        {categories.map((c) => (
          <div key={c.name} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
            <span className="text-xs font-medium text-slate-700 w-16 flex-shrink-0">{c.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${c.percent}%`, background: c.color }} />
            </div>
            <span className="text-xs font-bold text-slate-800 w-7 text-right flex-shrink-0">{c.percent}%</span>
            <span className="text-xs text-slate-400 w-16 text-right flex-shrink-0">{fmt(c.revenue)} ₫</span>
          </div>
        ))}

        <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs font-medium text-slate-500">Tổng cộng</span>
          <span className="text-sm font-bold text-slate-900">{fmt(totalRevenue)} ₫</span>
        </div>
      </div>
    </div>
  );
}
