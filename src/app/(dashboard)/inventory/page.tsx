"use client";

import { useState } from "react";
import { Download, SlidersHorizontal, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import InventoryStats      from "@/features/inventory/components/InventoryStats";
import InventoryFilters    from "@/features/inventory/components/InventoryFilters";
import InventoryTable      from "@/features/inventory/components/InventoryTable";
import InventoryLogTable   from "@/features/inventory/components/InventoryLogTable";
import AdjustStockModal    from "@/features/inventory/components/AdjustStockModal";
import TransferStockModal  from "@/features/inventory/components/TransferStockModal";
import { getStatus } from "@/features/inventory/types";
import type { StockItem, InventoryLog } from "@/features/inventory/types";

/* ══════════════ Mock data ══════════════ */
const stockItems: StockItem[] = [
  { id: "SP001", name: "Laptop Dell XPS 15",          warehouse: "Kho A - Kệ 3", current: 48,  min: 10, unit: "Cái",   lastIn: "12/04/2026", lastOut: "14/04/2026" },
  { id: "SP002", name: "Màn hình LG 27\" 4K",         warehouse: "Kho A - Kệ 1", current: 7,   min: 10, unit: "Cái",   lastIn: "10/04/2026", lastOut: "13/04/2026" },
  { id: "SP003", name: "Bàn phím cơ Keychron K8",     warehouse: "Kho B - Kệ 5", current: 124, min: 20, unit: "Cái",   lastIn: "08/04/2026", lastOut: "14/04/2026" },
  { id: "SP004", name: "Chuột Logitech MX Master 3",  warehouse: "Kho B - Kệ 5", current: 0,   min: 15, unit: "Cái",   lastIn: "01/04/2026", lastOut: "10/04/2026" },
  { id: "SP005", name: "SSD Samsung 970 EVO 1TB",     warehouse: "Kho C - Kệ 2", current: 56,  min: 20, unit: "Cái",   lastIn: "11/04/2026", lastOut: "15/04/2026" },
  { id: "SP006", name: "RAM Kingston 16GB DDR5",      warehouse: "Kho C - Kệ 2", current: 5,   min: 10, unit: "Thanh", lastIn: "05/04/2026", lastOut: "12/04/2026" },
  { id: "SP007", name: "Tai nghe Sony WH-1000XM5",   warehouse: "Kho A - Kệ 4", current: 33,  min: 5,  unit: "Cái",   lastIn: "09/04/2026", lastOut: "14/04/2026" },
  { id: "SP008", name: "Webcam Logitech C920",        warehouse: "Kho B - Kệ 3", current: 0,   min: 8,  unit: "Cái",   lastIn: "28/03/2026", lastOut: "07/04/2026" },
  { id: "SP009", name: "Hub USB-C Anker 7-in-1",     warehouse: "Kho B - Kệ 2", current: 88,  min: 15, unit: "Cái",   lastIn: "10/04/2026", lastOut: "15/04/2026" },
  { id: "SP010", name: "Card đồ họa RTX 4070",       warehouse: "Kho A - Kệ 2", current: 4,   min: 5,  unit: "Cái",   lastIn: "03/04/2026", lastOut: "11/04/2026" },
  { id: "SP011", name: "Ổ cứng WD Blue 2TB",         warehouse: "Kho C - Kệ 4", current: 72,  min: 20, unit: "Cái",   lastIn: "07/04/2026", lastOut: "13/04/2026" },
  { id: "SP012", name: "Bộ sạc Anker 65W GaN",       warehouse: "Kho B - Kệ 1", current: 0,   min: 20, unit: "Cái",   lastIn: "25/03/2026", lastOut: "05/04/2026" },
];

const MOCK_LOGS: InventoryLog[] = [
  { id: "l1",  type: "adjust_decrease", productId: "SP004", productName: "Chuột Logitech MX Master 3", qty: 3,  warehouse: "Kho B - Kệ 5",                                          reason: "Hàng hỏng / hết hạn",      note: "Phát hiện 3 cái bị vỡ vỏ khi kiểm kho",       createdAt: "09:15 14/04/2026", createdBy: "Admin" },
  { id: "l2",  type: "transfer",        productId: "SP005", productName: "SSD Samsung 970 EVO 1TB",    qty: 10, fromWarehouse: "Kho C",    toWarehouse: "Kho A",                    reason: "Chuyển kho nội bộ",         note: "Bổ sung cho Kho A trước đợt giao hàng",        createdAt: "08:40 14/04/2026", createdBy: "Admin" },
  { id: "l3",  type: "adjust_increase", productId: "SP003", productName: "Bàn phím cơ Keychron K8",   qty: 20, warehouse: "Kho B - Kệ 5",                                          reason: "Kiểm kê phát hiện thừa",    note: "",                                              createdAt: "15:20 13/04/2026", createdBy: "Admin" },
  { id: "l4",  type: "adjust_decrease", productId: "SP008", productName: "Webcam Logitech C920",       qty: 5,  warehouse: "Kho B - Kệ 3",                                          reason: "Mất mát",                   note: "Không tìm thấy sau kiểm kê định kỳ",           createdAt: "10:05 12/04/2026", createdBy: "Admin" },
  { id: "l5",  type: "transfer",        productId: "SP001", productName: "Laptop Dell XPS 15",         qty: 5,  fromWarehouse: "Kho B",    toWarehouse: "Kho A",                    reason: "Chuyển kho nội bộ",         note: "Theo yêu cầu đơn ORD-2026-089",                createdAt: "07:30 12/04/2026", createdBy: "Admin" },
  { id: "l6",  type: "adjust_decrease", productId: "SP012", productName: "Bộ sạc Anker 65W GaN",      qty: 8,  warehouse: "Kho B - Kệ 1",                                          reason: "Kiểm kê phát hiện thiếu",   note: "",                                              createdAt: "14:00 10/04/2026", createdBy: "Admin" },
  { id: "l7",  type: "transfer",        productId: "SP006", productName: "RAM Kingston 16GB DDR5",     qty: 30, fromWarehouse: "Kho A",    toWarehouse: "Kho C",                    reason: "Chuyển kho nội bộ",         note: "Cân bằng tồn kho giữa các kho",                createdAt: "11:00 09/04/2026", createdBy: "Admin" },
  { id: "l8",  type: "adjust_increase", productId: "SP010", productName: "Card đồ họa RTX 4070",      qty: 2,  warehouse: "Kho A - Kệ 2",                                          reason: "Hàng trả về",               note: "Khách trả hàng đơn ORD-2026-084",              createdAt: "09:30 09/04/2026", createdBy: "Admin" },
  { id: "l9",  type: "adjust_decrease", productId: "SP002", productName: "Màn hình LG 27\" 4K",       qty: 1,  warehouse: "Kho A - Kệ 1",                                          reason: "Hàng hỏng / hết hạn",      note: "Màn hình bị vỡ panel trong quá trình lưu kho", createdAt: "16:45 08/04/2026", createdBy: "Admin" },
  { id: "l10", type: "transfer",        productId: "SP009", productName: "Hub USB-C Anker 7-in-1",    qty: 15, fromWarehouse: "Kho A",    toWarehouse: "Kho B",                    reason: "Chuyển kho nội bộ",         note: "Kho B sắp hết cần bổ sung",                    createdAt: "08:00 07/04/2026", createdBy: "Admin" },
  { id: "l11", type: "adjust_increase", productId: "SP007", productName: "Tai nghe Sony WH-1000XM5", qty: 5,  warehouse: "Kho A - Kệ 4",                                          reason: "Kiểm kê phát hiện thừa",    note: "",                                              createdAt: "14:20 06/04/2026", createdBy: "Admin" },
  { id: "l12", type: "adjust_decrease", productId: "SP011", productName: "Ổ cứng WD Blue 2TB",       qty: 4,  warehouse: "Kho C - Kệ 4",                                          reason: "Hàng hỏng / hết hạn",      note: "Phát hiện lỗi bad sector khi kiểm tra",        createdAt: "10:10 05/04/2026", createdBy: "Admin" },
];

/* ══════════════ Page ══════════════ */
export default function InventoryPage() {
  const [tab,        setTab]        = useState<"stock" | "log">("stock");
  const [search,     setSearch]     = useState("");
  const [warehouse,  setWarehouse]  = useState("Tất cả");
  const [statusF,    setStatusF]    = useState("all");
  const [sortDir,    setSortDir]    = useState<"asc" | "desc" | null>(null);
  const [page,       setPage]       = useState(1);
  const [showAdjust,   setShowAdjust]   = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [logs,       setLogs]       = useState<InventoryLog[]>(MOCK_LOGS);

  const addLog = (log: InventoryLog) => setLogs((prev) => [log, ...prev]);

  const resetPage = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };

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

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý tồn kho</h1>
          <p className="text-sm text-slate-500 mt-0.5">Theo dõi số lượng hàng hoá theo từng vị trí kho</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <Download size={15} /> Xuất báo cáo
          </button>
          <button
            onClick={() => setShowAdjust(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal size={15} /> Điều chỉnh
          </button>
          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
          >
            <ArrowLeftRight size={15} /> Chuyển kho
          </button>
        </div>
      </div>

      <InventoryStats items={stockItems} />

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {([
          { key: "stock", label: "Tồn kho" },
          { key: "log",   label: `Lịch sử điều chỉnh${logs.length > 0 ? ` (${logs.length})` : ""}` },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
              tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "stock" ? (
        <>
          <InventoryFilters
            search={search}
            warehouse={warehouse}
            statusF={statusF}
            onSearch={resetPage(setSearch)}
            onWarehouse={resetPage(setWarehouse)}
            onStatus={resetPage(setStatusF)}
          />
          <InventoryTable
            items={filtered}
            total={filtered.length}
            page={page}
            sortDir={sortDir}
            onSort={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            onPage={setPage}
          />
        </>
      ) : (
        <InventoryLogTable logs={logs} />
      )}

      {showAdjust && (
        <AdjustStockModal
          items={stockItems}
          onClose={() => setShowAdjust(false)}
          onLog={addLog}
        />
      )}
      {showTransfer && (
        <TransferStockModal
          items={stockItems}
          onClose={() => setShowTransfer(false)}
          onLog={addLog}
        />
      )}

    </div>
  );
}
