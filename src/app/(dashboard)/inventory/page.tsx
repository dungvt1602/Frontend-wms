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
import type { InventoryLog } from "@/features/inventory/types";
import { STOCK_ITEMS, MOCK_LOGS } from "@/features/inventory/data/mock";

const stockItems = STOCK_ITEMS;

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
