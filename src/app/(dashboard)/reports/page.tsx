"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import RevenueChart from "@/features/reports/components/RevenueChart";
import TopProducts  from "@/features/reports/components/TopProducts";
import DonutChart   from "@/features/reports/components/DonutChart";
import type { Period, RevenuePoint, TopProduct, CategoryStat } from "@/features/reports/types";

/* ══════════════ Mock data ══════════════ */
const revenueData: Record<Period, RevenuePoint[]> = {
  "7d": [
    { label: "09/04", revenue: 42_000_000,  orders: 8  },
    { label: "10/04", revenue: 67_500_000,  orders: 13 },
    { label: "11/04", revenue: 55_200_000,  orders: 10 },
    { label: "12/04", revenue: 89_000_000,  orders: 17 },
    { label: "13/04", revenue: 73_400_000,  orders: 14 },
    { label: "14/04", revenue: 61_800_000,  orders: 11 },
    { label: "15/04", revenue: 98_500_000,  orders: 19 },
  ],
  "30d": [
    { label: "T1",  revenue: 210_000_000, orders: 41 },
    { label: "T2",  revenue: 185_000_000, orders: 36 },
    { label: "T3",  revenue: 240_000_000, orders: 47 },
    { label: "T4",  revenue: 195_000_000, orders: 38 },
    { label: "T5",  revenue: 270_000_000, orders: 53 },
    { label: "T6",  revenue: 225_000_000, orders: 44 },
    { label: "T7",  revenue: 310_000_000, orders: 61 },
    { label: "T8",  revenue: 280_000_000, orders: 55 },
    { label: "T9",  revenue: 175_000_000, orders: 34 },
    { label: "T10", revenue: 295_000_000, orders: 58 },
    { label: "T11", revenue: 320_000_000, orders: 63 },
    { label: "T12", revenue: 350_000_000, orders: 69 },
    { label: "T13", revenue: 265_000_000, orders: 52 },
    { label: "T14", revenue: 305_000_000, orders: 60 },
    { label: "T15", revenue: 415_000_000, orders: 81 },
  ],
  "90d": [
    { label: "Th1", revenue: 1_850_000_000, orders: 362 },
    { label: "Th2", revenue: 2_120_000_000, orders: 415 },
    { label: "Th3", revenue: 2_480_000_000, orders: 486 },
  ],
};

const topProducts: TopProduct[] = [
  { rank: 1, id: "SP003", name: "Bàn phím cơ Keychron K8",    category: "Phụ kiện",  sold: 248, revenue: 533_200_000, trend: "up"     },
  { rank: 2, id: "SP009", name: "Hub USB-C Anker 7-in-1",     category: "Phụ kiện",  sold: 195, revenue: 173_550_000, trend: "up"     },
  { rank: 3, id: "SP001", name: "Laptop Dell XPS 15",          category: "Điện tử",   sold: 142, revenue: 4_615_000_000, trend: "stable" },
  { rank: 4, id: "SP005", name: "SSD Samsung 970 EVO 1TB",    category: "Linh kiện", sold: 118, revenue: 377_600_000, trend: "up"     },
  { rank: 5, id: "SP004", name: "Chuột Logitech MX Master 3", category: "Phụ kiện",  sold: 97,  revenue: 183_330_000, trend: "down"   },
];

const categoryStats: CategoryStat[] = [
  { name: "Điện tử",   revenue: 4_615_000_000, percent: 52, color: "#6366f1" },
  { name: "Phụ kiện",  revenue: 2_140_000_000, percent: 31, color: "#a78bfa" },
  { name: "Linh kiện", revenue: 1_190_000_000, percent: 17, color: "#f59e0b" },
];

/* ══════════════ Page ══════════════ */
export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("7d");

  const currentData  = revenueData[period];
  const totalRevenue = categoryStats.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Báo cáo & Thống kê</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tổng hợp hoạt động kinh doanh theo thời gian</p>
        </div>
        <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
          <Download size={15} /> Xuất báo cáo
        </button>
      </div>

      {/* Top row: biểu đồ tròn + biểu đồ doanh thu */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        <DonutChart categories={categoryStats} totalRevenue={totalRevenue} />
        <RevenueChart data={revenueData} period={period} onPeriod={setPeriod} />
      </div>

      {/* Bottom row: top sản phẩm */}
      <TopProducts products={topProducts} />

    </div>
  );
}
