"use client";

import { useState, useMemo } from "react";
import { Plus, Search, ClipboardCheck, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { MOCK_STOCKTAKES } from "@/features/stocktake/data/mock";
import { Stocktake, StocktakeStatus } from "@/features/stocktake/types";
import StocktakeStats from "@/features/stocktake/components/StocktakeStats";
import StocktakeTable from "@/features/stocktake/components/StocktakeTable";
import CreateStocktakeModal from "@/features/stocktake/components/CreateStocktakeModal";
import { cn } from "@/lib/utils";

const STATUS_TABS: { value: StocktakeStatus | ""; label: string }[] = [
  { value: "",                 label: "Tất cả"    },
  { value: "draft",            label: "Nháp"      },
  { value: "counting",         label: "Đang kiểm" },
  { value: "pending_approval", label: "Chờ duyệt" },
  { value: "completed",        label: "Hoàn tất"  },
];

export default function StocktakePage() {
  const router = useRouter();

  const [allItems, setAllItems]     = useState<Stocktake[]>(MOCK_STOCKTAKES);
  const [search, setSearch]         = useState("");
  const [statusF, setStatusF]       = useState<StocktakeStatus | "">("");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage]             = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useMemo(() => allItems.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      item.code.toLowerCase().includes(q) ||
      item.warehouseName.toLowerCase().includes(q) ||
      item.assignedTo.toLowerCase().includes(q);
    const matchStatus = statusF === "" || item.status === statusF;
    return matchSearch && matchStatus;
  }), [allItems, search, statusF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetPage() { setPage(1); }

  const total          = allItems.length;
  const draft          = allItems.filter((i) => i.status === "draft").length;
  const counting       = allItems.filter((i) => i.status === "counting").length;
  const pendingApproval = allItems.filter((i) => i.status === "pending_approval").length;
  const completed      = allItems.filter((i) => i.status === "completed").length;

  function handleView(id: string) {
    router.push(`/stocktake/${id}`);
  }

  function handleCreate(data: {
    warehouseName: string;
    assignedTo: string;
    scheduledDate: string;
    note: string;
  }) {
    const nextIndex  = allItems.length + 1;
    const paddedIndex = String(nextIndex).padStart(3, "0");
    const newItem: Stocktake = {
      id:            `st-${paddedIndex}`,
      code:          `KK-2024-${paddedIndex}`,
      warehouseId:   "",
      warehouseName: data.warehouseName,
      status:        "draft",
      assignedTo:    data.assignedTo,
      createdBy:     "Admin",
      createdAt:     new Date().toISOString(),
      scheduledDate: data.scheduledDate,
      note:          data.note,
      items:         [],
    };
    setAllItems((prev) => [newItem, ...prev]);
  }

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon accent */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0"
               style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
            <ClipboardCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kiểm kê kho</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Quản lý và theo dõi các phiên kiểm kê tồn kho
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
        >
          <Plus size={16} />
          Tạo phiên kiểm kê
        </button>
      </div>

      {/* ── Stats ── */}
      <StocktakeStats
        total={total}
        draft={draft}
        counting={counting}
        pendingApproval={pendingApproval}
        completed={completed}
      />

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
        {/* Search row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Tìm theo mã phiên, kho, người phụ trách..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
            <SlidersHorizontal size={13} />
            <span>{filtered.length} kết quả</span>
          </div>
        </div>

        {/* Status pill tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.value === ""                 ? total          :
              tab.value === "draft"            ? draft          :
              tab.value === "counting"         ? counting       :
              tab.value === "pending_approval" ? pendingApproval :
              completed;

            return (
              <button
                key={tab.value}
                onClick={() => { setStatusF(tab.value); resetPage(); }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150",
                  statusF === tab.value
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {tab.label}
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                  statusF === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-white text-slate-500"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <StocktakeTable items={paginated} onView={handleView} />

        {/* Pagination footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Hiển thị{" "}
              <span className="font-semibold text-slate-700">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              trong{" "}
              <span className="font-semibold text-slate-700">{filtered.length}</span> phiên
            </p>

            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-semibold transition-all",
                    p === safePage
                      ? "text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  style={p === safePage ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
                >
                  {p}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateStocktakeModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
