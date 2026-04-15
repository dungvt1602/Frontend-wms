"use client";

import { useState } from "react";
import {
  Search, Filter, Download, ArrowUpDown,
  PackageOpen, AlertTriangle, CheckCircle2,
  XCircle, ChevronLeft, ChevronRight,
  TrendingDown, TrendingUp, ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ══════════════ Mock data ══════════════ */
const stockItems = [
  { id: "SP001", name: "Laptop Dell XPS 15",          warehouse: "Kho A - Kệ 3",  current: 48,  min: 10, unit: "Cái",   lastIn: "12/04/2026",  lastOut: "14/04/2026" },
  { id: "SP002", name: "Màn hình LG 27\" 4K",         warehouse: "Kho A - Kệ 1",  current: 7,   min: 10, unit: "Cái",   lastIn: "10/04/2026",  lastOut: "13/04/2026" },
  { id: "SP003", name: "Bàn phím cơ Keychron K8",     warehouse: "Kho B - Kệ 5",  current: 124, min: 20, unit: "Cái",   lastIn: "08/04/2026",  lastOut: "14/04/2026" },
  { id: "SP004", name: "Chuột Logitech MX Master 3",  warehouse: "Kho B - Kệ 5",  current: 0,   min: 15, unit: "Cái",   lastIn: "01/04/2026",  lastOut: "10/04/2026" },
  { id: "SP005", name: "SSD Samsung 970 EVO 1TB",     warehouse: "Kho C - Kệ 2",  current: 56,  min: 20, unit: "Cái",   lastIn: "11/04/2026",  lastOut: "15/04/2026" },
  { id: "SP006", name: "RAM Kingston 16GB DDR5",      warehouse: "Kho C - Kệ 2",  current: 5,   min: 10, unit: "Thanh", lastIn: "05/04/2026",  lastOut: "12/04/2026" },
  { id: "SP007", name: "Tai nghe Sony WH-1000XM5",   warehouse: "Kho A - Kệ 4",  current: 33,  min: 5,  unit: "Cái",   lastIn: "09/04/2026",  lastOut: "14/04/2026" },
  { id: "SP008", name: "Webcam Logitech C920",        warehouse: "Kho B - Kệ 3",  current: 0,   min: 8,  unit: "Cái",   lastIn: "28/03/2026",  lastOut: "07/04/2026" },
  { id: "SP009", name: "Hub USB-C Anker 7-in-1",     warehouse: "Kho B - Kệ 2",  current: 88,  min: 15, unit: "Cái",   lastIn: "10/04/2026",  lastOut: "15/04/2026" },
  { id: "SP010", name: "Card đồ họa RTX 4070",       warehouse: "Kho A - Kệ 2",  current: 4,   min: 5,  unit: "Cái",   lastIn: "03/04/2026",  lastOut: "11/04/2026" },
  { id: "SP011", name: "Ổ cứng WD Blue 2TB",         warehouse: "Kho C - Kệ 4",  current: 72,  min: 20, unit: "Cái",   lastIn: "07/04/2026",  lastOut: "13/04/2026" },
  { id: "SP012", name: "Bộ sạc Anker 65W GaN",       warehouse: "Kho B - Kệ 1",  current: 0,   min: 20, unit: "Cái",   lastIn: "25/03/2026",  lastOut: "05/04/2026" },
];

function getStatus(current: number, min: number) {
  if (current === 0)         return "out";
  if (current < min)         return "low";
  return "ok";
}

const statusConfig = {
  ok:  { label: "Đủ hàng",  icon: CheckCircle2,  cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  low: { label: "Sắp hết",  icon: AlertTriangle, cls: "text-amber-700   bg-amber-50   border-amber-200"   },
  out: { label: "Hết hàng", icon: XCircle,       cls: "text-red-700     bg-red-50     border-red-200"     },
};

const warehouses = ["Tất cả", "Kho A", "Kho B", "Kho C"];
const PAGE_SIZE  = 8;

export default function InventoryPage() {
  const [search,    setSearch]    = useState("");
  const [warehouse, setWarehouse] = useState("Tất cả");
  const [statusF,   setStatusF]   = useState("all");
  const [sortDir,   setSortDir]   = useState<"asc" | "desc" | null>(null);
  const [page,      setPage]      = useState(1);

  const filtered = stockItems
    .filter((p) => {
      const q  = search.toLowerCase();
      const st = getStatus(p.current, p.min);
      return (
        (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
        (warehouse === "Tất cả" || p.warehouse.startsWith(warehouse)) &&
        (statusF === "all" || st === statusF)
      );
    })
    .sort((a, b) => {
      if (!sortDir) return 0;
      return sortDir === "asc" ? a.current - b.current : b.current - a.current;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const okCount  = stockItems.filter((p) => getStatus(p.current, p.min) === "ok").length;
  const lowCount = stockItems.filter((p) => getStatus(p.current, p.min) === "low").length;
  const outCount = stockItems.filter((p) => getStatus(p.current, p.min) === "out").length;

  return (
    <div className="space-y-5 max-w-[1400px]">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý tồn kho</h1>
          <p className="text-sm text-slate-500 mt-0.5">Theo dõi số lượng hàng hoá theo từng vị trí kho</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <Download size={15} /> Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <TrendingDown size={15} /> Xuất kho
          </button>
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}>
            <TrendingUp size={15} /> Nhập kho
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Đủ hàng",  value: okCount,  icon: CheckCircle2,  bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
          { label: "Sắp hết",  value: lowCount, icon: AlertTriangle, bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200"   },
          { label: "Hết hàng", value: outCount, icon: XCircle,       bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200"     },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={cn("flex items-center gap-3 bg-white rounded-xl p-4 border", s.border)}>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", s.bg)}>
                <Icon className={cn("h-[18px] w-[18px]", s.text)} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value} <span className="text-sm font-normal text-slate-400">mặt hàng</span></p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Tìm mã hàng, tên sản phẩm..."
                   value={search}
                   onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                   className="w-full h-9 pl-9 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
          </div>

          {/* Warehouse tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {warehouses.map((w) => (
              <button key={w} onClick={() => { setWarehouse(w); setPage(1); }}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        warehouse === w ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                {w}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select value={statusF} onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                    className="h-9 pl-8 pr-6 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-600 outline-none focus:border-indigo-400 appearance-none cursor-pointer">
              <option value="all">Tất cả trạng thái</option>
              <option value="ok">Đủ hàng</option>
              <option value="low">Sắp hết</option>
              <option value="out">Hết hàng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 w-[90px]">Mã hàng</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Tên sản phẩm</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Vị trí kho</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 cursor-pointer select-none"
                    onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}>
                  <span className="flex items-center gap-1">
                    Tồn kho
                    <ArrowUpDown size={13} className={cn(sortDir ? "text-indigo-500" : "text-slate-300")} />
                  </span>
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Tối thiểu</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Nhập gần nhất</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Xuất gần nhất</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 w-[50px]"></th>
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
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">{p.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">{p.name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.warehouse}</td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1.5">
                        <span className={cn("font-bold text-sm",
                          st === "out" ? "text-red-500" : st === "low" ? "text-amber-500" : "text-slate-800")}>
                          {p.current} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                        </span>
                        {/* progress bar */}
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
                    <td className="px-5 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all">
                        <ArrowLeftRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Hiển thị <span className="font-medium text-slate-700">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> / <span className="font-medium text-slate-700">{filtered.length}</span> mặt hàng
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                        className={cn("w-8 h-8 rounded-lg text-xs font-medium transition-all",
                          n === page ? "text-white" : "text-slate-600 hover:bg-slate-100")}
                        style={n === page ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
