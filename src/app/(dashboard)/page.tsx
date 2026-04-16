import type { ElementType } from "react";
import {
  Package, ClipboardList, AlertTriangle,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AllOrdersButton from "@/features/dashboard/components/AllOrdersButton";
import type { DashboardOrder } from "@/features/dashboard/components/RecentOrdersModal";

/* ═══════════════ Mock data ═══════════════ */
const stats = [
  { label: "Tổng sản phẩm",    value: "12,480",   change: "+3.2%",  up: true,  icon: Package,       bg: "bg-indigo-50",  text: "text-indigo-600"  },
  { label: "Đơn hàng hôm nay", value: "340",       change: "+12.5%", up: true,  icon: ClipboardList, bg: "bg-emerald-50", text: "text-emerald-600" },
  { label: "Cảnh báo tồn kho", value: "8",         change: "+2",     up: false, icon: AlertTriangle, bg: "bg-amber-50",   text: "text-amber-600"   },
  { label: "Doanh thu tháng",   value: "₫1.24 tỷ", change: "+8.1%",  up: true,  icon: TrendingUp,    bg: "bg-blue-50",    text: "text-blue-600"    },
];

const allOrders: DashboardOrder[] = [
  { id: "ORD-089", product: "Laptop Dell XPS 15",         qty: 12, warehouse: "Kho A", status: "completed", time: "08:32" },
  { id: "ORD-088", product: "Màn hình LG 27\"",            qty: 5,  warehouse: "Kho B", status: "shipping",  time: "08:15" },
  { id: "ORD-087", product: "Bàn phím cơ Keychron K8",    qty: 30, warehouse: "Kho A", status: "pending",   time: "07:58" },
  { id: "ORD-086", product: "Chuột Logitech MX Master",   qty: 20, warehouse: "Kho C", status: "completed", time: "07:40" },
  { id: "ORD-085", product: "SSD Samsung 1TB",             qty: 50, warehouse: "Kho B", status: "cancelled", time: "07:20" },
  { id: "ORD-084", product: "Hub USB-C Anker 7-in-1",     qty: 8,  warehouse: "Kho A", status: "completed", time: "06:55" },
  { id: "ORD-083", product: "RAM Kingston 16GB DDR5",     qty: 40, warehouse: "Kho C", status: "shipping",  time: "06:30" },
  { id: "ORD-082", product: "Tai nghe Sony WH-1000XM5",   qty: 3,  warehouse: "Kho B", status: "pending",   time: "06:10" },
  { id: "ORD-081", product: "Webcam Logitech C920",        qty: 15, warehouse: "Kho A", status: "completed", time: "05:48" },
  { id: "ORD-080", product: "Bộ sạc Anker 65W GaN",       qty: 25, warehouse: "Kho B", status: "completed", time: "05:20" },
  { id: "ORD-079", product: "Card đồ họa RTX 4070",        qty: 2,  warehouse: "Kho C", status: "cancelled", time: "04:55" },
  { id: "ORD-078", product: "Màn hình Dell UltraSharp",   qty: 7,  warehouse: "Kho A", status: "shipping",  time: "04:30" },
];

const previewOrders = allOrders.slice(0, 5);

const activities = [
  { text: "Xuất kho 12 Laptop Dell — Kho A",         time: "5 phút trước",  color: "bg-indigo-500"  },
  { text: "Cảnh báo: SP001 dưới mức tối thiểu",      time: "18 phút trước", color: "bg-amber-500"   },
  { text: "Nhập kho 200 SSD Samsung — Kho B",        time: "1 giờ trước",   color: "bg-emerald-500" },
  { text: "Đơn ORD-085 bị huỷ bởi khách hàng",      time: "2 giờ trước",   color: "bg-red-500"     },
  { text: "Minh Phát xác nhận đơn nhập 500 đơn vị", time: "3 giờ trước",   color: "bg-blue-500"    },
];

const chartData = [65, 78, 52, 91, 73, 88, 95];
const chartDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const maxVal    = Math.max(...chartData);

const statusMap: Record<string, { label: string; icon: ElementType; cls: string }> = {
  completed: { label: "Hoàn thành", icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50" },
  shipping:  { label: "Đang giao",  icon: Loader2,      cls: "text-blue-600 bg-blue-50"       },
  pending:   { label: "Chờ xử lý", icon: Clock,        cls: "text-amber-600 bg-amber-50"     },
  cancelled: { label: "Đã huỷ",    icon: XCircle,      cls: "text-red-600 bg-red-50"         },
};

export default function DashboardPage() {
  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">{greeting}, Admin 👋</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Đây là tình hình kho hàng hôm nay,{" "}
          {now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                  <Icon className={cn("h-5 w-5", s.text)} />
                </div>
                <span className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full",
                  s.up ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
                )}>
                  {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {s.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Đơn hàng 7 ngày qua</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tổng đơn xuất kho theo ngày</p>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={11} /> +18% so với tuần trước
            </span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-400">{val}</span>
                <div className="w-full rounded-t-lg overflow-hidden"
                     style={{ height: `${(val / maxVal) * 100}%`, minHeight: "8px" }}>
                  <div className="h-full w-full rounded-t-lg"
                       style={{
                         background: i === chartData.length - 1
                           ? "linear-gradient(180deg,#6366f1,#4f46e5)"
                           : "linear-gradient(180deg,#c7d2fe,#e0e7ff)",
                       }} />
                </div>
                <span className="text-[10px] text-slate-400">{chartDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <span className={cn("w-2 h-2 rounded-full mt-1.5 block", a.color)} />
                  {i < activities.length - 1 && (
                    <span className="absolute left-[3px] top-4 w-px h-6 bg-slate-200" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Đơn hàng gần đây</h3>
          <AllOrdersButton orders={allOrders} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Mã đơn", "Sản phẩm", "SL", "Kho", "Trạng thái", "Giờ"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {previewOrders.map((o) => {
                const s = statusMap[o.status];
                const StatusIcon = s.icon;
                return (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-600">{o.id}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium whitespace-nowrap">{o.product}</td>
                    <td className="px-5 py-3.5 text-slate-600">{o.qty}</td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{o.warehouse}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap", s.cls)}>
                        <StatusIcon size={11} className={o.status === "shipping" ? "animate-spin" : ""} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{o.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
