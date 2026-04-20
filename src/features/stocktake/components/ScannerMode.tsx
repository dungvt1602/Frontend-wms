"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Zap, ClipboardList } from "lucide-react";
import { StocktakeItem } from "../types";
import { useConfirm } from "@/hooks/useConfirm";

interface ScannerModeProps {
  items: StocktakeItem[];
  onItemScanned: (productId: string, qty: number, note: string) => void;
}

interface PendingScan {
  item: StocktakeItem;
  qty: number;
  note: string;
}

interface HistoryEntry {
  item: StocktakeItem;
  qty: number;
  diff: number;
}

interface FlashMsg {
  id: number;
  text: string;
  sub: string;
  ok: boolean;
}

function formatNum(n: number) {
  return n.toLocaleString("vi-VN");
}

export default function ScannerMode({ items, onItemScanned }: ScannerModeProps) {
  const scanInputRef  = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const flashTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const { confirm, modal } = useConfirm();

  const [inputVal,     setInputVal]     = useState("");
  const [pendingScan,  setPendingScan]  = useState<PendingScan | null>(null);
  const [history,      setHistory]      = useState<HistoryEntry[]>([]);
  const [errorMsg,     setErrorMsg]     = useState("");
  const [autoMode,     setAutoMode]     = useState(false);
  const [flashes,      setFlashes]      = useState<FlashMsg[]>([]);
  const flashId = useRef(0);

  // Keep input focused (only when no pending card)
  useEffect(() => {
    if (!pendingScan) scanInputRef.current?.focus();
    const handleClick = () => { if (!pendingScan) scanInputRef.current?.focus(); };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pendingScan]);

  // Reset pendingScan when switching to autoMode
  useEffect(() => {
    if (autoMode) {
      setPendingScan(null);
      setTimeout(() => scanInputRef.current?.focus(), 50);
    }
  }, [autoMode]);

  // ── Flash notification helper ─────────────────────────────────────────────

  function addFlash(text: string, sub: string, ok: boolean) {
    const id = ++flashId.current;
    setFlashes((prev) => [...prev, { id, text, sub, ok }]);
    setTimeout(() => setFlashes((prev) => prev.filter((f) => f.id !== id)), 2000);
  }

  function showError(msg: string) {
    setErrorMsg(msg);
    clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMsg(""), 2000);
  }

  // ── Scan handler ──────────────────────────────────────────────────────────

  function handleScanKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const val = inputVal.trim();
    if (!val) return;

    const found = items.find((i) => i.sku.toLowerCase() === val.toLowerCase());
    setInputVal("");

    if (!found) {
      addFlash(`Không tìm thấy SKU`, val, false);
      return;
    }

    if (autoMode) {
      // ── Luồng B: tự động +1 ───────────────────────────────────────────
      const currentQty = found.actualQty ?? 0;
      const newQty     = currentQty + 1;
      onItemScanned(found.productId, newQty, "");
      setHistory((prev) => [{ item: found, qty: newQty, diff: newQty - found.systemQty }, ...prev].slice(0, 10));
      addFlash(found.productName, `${formatNum(newQty)} ${found.unit}  (+1)`, true);
    } else {
      // ── Luồng A: hiện card xác nhận ───────────────────────────────────
      setPendingScan({ item: found, qty: found.systemQty, note: "" });
    }
  }

  // ── Confirm (Luồng A) ─────────────────────────────────────────────────────

  async function handleConfirmClick() {
    if (!pendingScan) return;
    const diff = pendingScan.qty - pendingScan.item.systemQty;
    const ok = await confirm({
      title: "Xác nhận kiểm kê?",
      confirmLabel: "Đồng ý",
      cancelLabel: "Từ chối",
      variant: "primary",
      details: [
        { label: "Mặt hàng",    value: pendingScan.item.productName },
        { label: "SKU",          value: pendingScan.item.sku, highlight: true },
        { label: "Tồn hệ thống", value: `${pendingScan.item.systemQty} ${pendingScan.item.unit}` },
        { label: "Thực đếm",     value: `${pendingScan.qty} ${pendingScan.item.unit}`, highlight: true },
        ...(diff !== 0 ? [{ label: "Chênh lệch", value: diff > 0 ? `+${diff}` : `${diff}`, highlight: true }] : []),
      ],
    });
    if (!ok) return;
    onItemScanned(pendingScan.item.productId, pendingScan.qty, pendingScan.note);
    setHistory((prev) => [{ item: pendingScan.item, qty: pendingScan.qty, diff }, ...prev].slice(0, 10));
    setPendingScan(null);
    setTimeout(() => scanInputRef.current?.focus(), 50);
  }

  function handleSkip() {
    setPendingScan(null);
    setTimeout(() => scanInputRef.current?.focus(), 50);
  }

  const isWaiting = !pendingScan;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Flash notifications stack ──────────────────────────────────────── */}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {flashes.map((f) => (
          <div key={f.id} className={cn(
            "flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium",
            "animate-in slide-in-from-right-4 fade-in duration-200",
            f.ok
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-700"
          )}>
            <span className="text-lg leading-none">{f.ok ? "✓" : "✕"}</span>
            <div>
              <p className="font-semibold leading-tight truncate max-w-[220px]">{f.text}</p>
              <p className="text-xs opacity-70 mt-0.5">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mode toggle ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5">
        <button
          onClick={() => setAutoMode(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
            !autoMode
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <ClipboardList size={15} />
          Luồng A — Xác nhận thủ công
        </button>
        <button
          onClick={() => setAutoMode(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
            autoMode
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Zap size={15} />
          Luồng B — Tự động +1
        </button>
      </div>

      {/* ── Scan input area ────────────────────────────────────────────────── */}
      <div className={cn(
        "relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-colors",
        isWaiting ? "border-indigo-300" : "border-slate-200"
      )}>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
              <span className="text-xl">📡</span>
              Scanner cầm tay
            </div>
            <p className="mt-0.5 text-sm text-slate-400">
              {autoMode
                ? "Quét barcode → tự động +1 số lượng, không cần xác nhận"
                : "Quét barcode → điền số lượng → xác nhận"}
            </p>
          </div>

          {isWaiting && (
            <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Sẵn sàng quét
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-md">
            <input
              ref={scanInputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleScanKeyDown}
              placeholder={autoMode ? "Quét → tự động lưu..." : "Đang chờ quét mã SKU..."}
              disabled={!!pendingScan}
              className={cn(
                "w-full rounded-xl border-2 px-4 py-3",
                "text-center font-mono text-lg text-slate-800 placeholder:text-slate-300",
                "outline-none transition-all duration-150",
                isWaiting
                  ? "border-indigo-300 bg-indigo-50/40 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-400/20"
                  : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              )}
            />
            <p className="mt-1.5 text-center text-xs text-slate-400">
              Nhấn <kbd className="rounded border border-slate-300 bg-slate-100 px-1 py-0.5 font-mono text-[11px]">Enter</kbd> để xác nhận
              {autoMode && <span className="ml-2 text-indigo-500 font-medium">• Tự động +1 mỗi lần quét</span>}
            </p>
          </div>
        </div>

        {/* Error toast */}
        {errorMsg && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg whitespace-nowrap">
            ✕ {errorMsg}
          </div>
        )}
      </div>

      {/* ── Luồng A: Pending card ──────────────────────────────────────────── */}
      {!autoMode && pendingScan && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-white p-5 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">✓</span>
            <span className="font-semibold text-slate-700">
              Tìm thấy: <span className="text-indigo-700">{pendingScan.item.productName}</span>
            </span>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
            <span>SKU: <span className="font-mono font-semibold text-indigo-600">{pendingScan.item.sku}</span></span>
            <span className="text-slate-300">|</span>
            <span>Tồn HT: <span className="font-semibold text-slate-800">{formatNum(pendingScan.item.systemQty)}</span> {pendingScan.item.unit}</span>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Số lượng thực đếm</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={0} autoFocus
                  value={pendingScan.qty}
                  onChange={(e) => setPendingScan((p) => p ? { ...p, qty: Number(e.target.value) || 0 } : p)}
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-right font-mono text-base font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                />
                <span className="text-sm text-slate-500">{pendingScan.item.unit}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Ghi chú</label>
              <input
                type="text" placeholder="Tuỳ chọn..."
                value={pendingScan.note}
                onChange={(e) => setPendingScan((p) => p ? { ...p, note: e.target.value } : p)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>
          </div>

          {/* Diff preview */}
          {(() => {
            const diff = pendingScan.qty - pendingScan.item.systemQty;
            return (
              <p className="mb-4 text-sm">
                <span className="text-slate-500">Chênh lệch: </span>
                <span className={cn("font-semibold", diff < 0 ? "text-red-500" : diff > 0 ? "text-green-600" : "text-slate-400")}>
                  {diff > 0 ? `+${formatNum(diff)}` : formatNum(diff)}
                </span>
              </p>
            );
          })()}

          <div className="flex gap-3">
            <button onClick={handleConfirmClick}
                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
              Xác nhận
            </button>
            <button onClick={handleSkip}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Bỏ qua
            </button>
          </div>
        </div>
      )}

      {/* ── History ────────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vừa quét ({history.length})
          </div>
          <ul className="divide-y divide-slate-50">
            {history.map((entry, idx) => {
              const diff = entry.diff;
              return (
                <li key={idx} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="shrink-0 font-mono text-xs text-indigo-500">{entry.item.sku}</span>
                  <span className="min-w-0 flex-1 truncate text-slate-600">{entry.item.productName}</span>
                  <span className="shrink-0 text-slate-500">{formatNum(entry.qty)}/{formatNum(entry.item.systemQty)}</span>
                  <span className={cn("shrink-0 font-semibold text-xs px-2 py-0.5 rounded-full",
                    diff === 0 ? "bg-green-100 text-green-700" :
                    diff < 0  ? "bg-red-100 text-red-600" :
                                "bg-blue-100 text-blue-700"
                  )}>
                    {diff > 0 ? `+${formatNum(diff)}` : formatNum(diff)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {modal}
    </div>
  );
}
