"use client";

import { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useConfirm } from "@/hooks/useConfirm";
import {
  Camera, CameraOff, CheckCircle2, AlertTriangle,
  XCircle, RotateCcw, ScanLine, Clock, Package, RefreshCw,
  Zap, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StocktakeItem } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type CamState = "idle" | "requesting" | "active" | "paused" | "error";

interface CameraModeProps {
  items: StocktakeItem[];
  onItemScanned: (productId: string, qty: number, note: string) => void;
}

interface HistoryEntry {
  item: StocktakeItem;
  qty: number;
  diff: number;
}

const READER_ID = "stocktake-qr-reader";

// ─── Diff badge ───────────────────────────────────────────────────────────────

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 border border-green-200">
        Khớp
      </span>
    );
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
      diff > 0 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"
    )}>
      {diff > 0 ? `+${diff}` : diff}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CameraMode({ items, onItemScanned }: CameraModeProps) {
  const { confirm, modal } = useConfirm();
  const [camState,    setCamState]    = useState<CamState>("idle");
  const [errorMsg,    setErrorMsg]    = useState("");
  const [pendingScan, setPendingScan] = useState<{ item: StocktakeItem; qty: number; note: string } | null>(null);
  const [history,     setHistory]     = useState<HistoryEntry[]>([]);
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [autoMode,    setAutoMode]    = useState(false);
  const [flashes,     setFlashes]     = useState<{ id: number; text: string; sub: string }[]>([]);
  const flashId = useRef(0);

  const html5QrRef    = useRef<Html5Qrcode | null>(null);
  const isPausedRef   = useRef(false);
  const isRunningRef  = useRef(false);
  const autoModeRef   = useRef(false);   // mirror of autoMode for use inside callback
  const notFoundTimer = useRef<ReturnType<typeof setTimeout>>();

  // Keep autoModeRef in sync
  autoModeRef.current = autoMode;

  // ── Flash helper ──────────────────────────────────────────────────────────────

  function addFlash(text: string, sub: string) {
    const id = ++flashId.current;
    setFlashes((prev) => [...prev, { id, text, sub }]);
    setTimeout(() => setFlashes((prev) => prev.filter((f) => f.id !== id)), 2000);
  }

  // ── Start camera ─────────────────────────────────────────────────────────────

  async function startCamera() {
    setCamState("requesting");
    setErrorMsg("");
    isPausedRef.current = false;

    try {
      const qr = new Html5Qrcode(READER_ID);
      html5QrRef.current = qr;

      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },

        // ── On scan success ──────────────────────────────────────────────────
        (decodedText) => {
          if (isPausedRef.current) return;   // already showing card

          const found = items.find(
            (it) => it.sku.toLowerCase() === decodedText.trim().toLowerCase()
          );

          if (found) {
            if (autoModeRef.current) {
              // ── Luồng B: tự động +1 ────────────────────────────────────
              const newQty = (found.actualQty ?? 0) + 1;
              onItemScanned(found.productId, newQty, "");
              setHistory((prev) => [{ item: found, qty: newQty, diff: newQty - found.systemQty }, ...prev].slice(0, 5));
              addFlash(found.productName, `${newQty} ${found.unit}  (+1)`);
              // debounce: don't re-trigger same code for 1.5s
              setTimeout(() => { isPausedRef.current = false; }, 1500);
            } else {
              // ── Luồng A: hiện card xác nhận ────────────────────────────
              isPausedRef.current = true;
              setPendingScan({ item: found, qty: found.systemQty, note: "" });
              setCamState("paused");
            }
          } else {
            clearTimeout(notFoundTimer.current);
            setNotFoundMsg(`Không tìm thấy: ${decodedText}`);
            notFoundTimer.current = setTimeout(() => setNotFoundMsg(""), 2500);
            setTimeout(() => { isPausedRef.current = false; }, 1500);
          }
        },

        // ── On scan failure (no barcode in frame — ignore) ────────────────
        () => {},
      );

      isRunningRef.current = true;
      setCamState("active");
    } catch (err: any) {
      html5QrRef.current = null;
      setCamState("error");
      setErrorMsg(err?.message ?? "Không thể truy cập camera");
    }
  }

  // ── Stop camera ───────────────────────────────────────────────────────────────

  async function stopCamera() {
    if (html5QrRef.current && isRunningRef.current) {
      try {
        await html5QrRef.current.stop();
      } catch { /* ignore */ }
    }
    html5QrRef.current = null;
    isRunningRef.current = false;
    isPausedRef.current  = false;
    setCamState("idle");
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(notFoundTimer.current);
      if (html5QrRef.current && isRunningRef.current) {
        try { html5QrRef.current.stop(); } catch { /* ignore */ }
      }
    };
  }, []);

  // ── Resume scanning after confirm / skip ──────────────────────────────────────

  async function confirmScan() {
    if (!pendingScan) return;
    const ok = await confirm({
      title: "Xác nhận kết quả quét?",
      variant: "primary",
      confirmLabel: "Đồng ý",
      cancelLabel: "Từ chối",
      details: [
        { label: "Mặt hàng",    value: pendingScan.item.productName },
        { label: "SKU",          value: pendingScan.item.sku, highlight: true },
        { label: "Tồn hệ thống", value: `${pendingScan.item.systemQty} ${pendingScan.item.unit}` },
        { label: "Thực đếm",    value: `${pendingScan.qty} ${pendingScan.item.unit}`, highlight: true },
      ],
    });
    if (!ok) return;
    onItemScanned(pendingScan.item.productId, pendingScan.qty, pendingScan.note);
    const diff = pendingScan.qty - pendingScan.item.systemQty;
    setHistory((prev) => [{ item: pendingScan.item, qty: pendingScan.qty, diff }, ...prev].slice(0, 5));
    setPendingScan(null);
    isPausedRef.current = false;
    setCamState("active");
  }

  function skipScan() {
    setPendingScan(null);
    isPausedRef.current = false;
    setCamState("active");
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Suppress html5-qrcode default header/footer styles */}
      <style>{`
        #${READER_ID} > img { display: none !important; }
        #${READER_ID} video { border-radius: 16px; width: 100% !important; }
        #${READER_ID} { border: none !important; padding: 0 !important; }
        #${READER_ID} > div:first-child { display: none !important; }
      `}</style>

      <div className="space-y-5">

        {/* ── Flash notifications ── */}
        <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
          {flashes.map((f) => (
            <div key={f.id} className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-800 text-sm font-medium animate-in slide-in-from-right-4 fade-in duration-200">
              <span className="text-lg leading-none">✓</span>
              <div>
                <p className="font-semibold leading-tight truncate max-w-[220px]">{f.text}</p>
                <p className="text-xs opacity-70 mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Mode toggle ── */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5">
          <button
            onClick={() => { setAutoMode(false); if (camState === "paused") { setPendingScan(null); isPausedRef.current = false; setCamState("active"); } }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
              !autoMode ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <ClipboardList size={15} /> Luồng A — Xác nhận thủ công
          </button>
          <button
            onClick={() => { setAutoMode(true); if (camState === "paused") { setPendingScan(null); isPausedRef.current = false; setCamState("active"); } }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
              autoMode ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Zap size={15} /> Luồng B — Tự động +1
          </button>
        </div>

        {/* ── Camera panel ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Idle */}
          {camState === "idle" && (
            <div className="flex flex-col items-center gap-5 py-12 text-center px-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Camera size={36} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">Quét mã vạch bằng Camera</h3>
                <p className="text-sm text-slate-400 mt-1">Hỗ trợ QR Code, Code 128, EAN-13, EAN-8…</p>
              </div>
              <button onClick={startCamera}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow"
                      style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                <Camera size={16} /> Bật camera
              </button>
            </div>
          )}

          {/* Requesting */}
          {camState === "requesting" && (
            <div className="flex flex-col items-center gap-4 py-16 text-slate-500">
              <RefreshCw size={28} className="animate-spin text-indigo-500" />
              <p className="text-sm font-medium">Đang khởi động camera...</p>
            </div>
          )}

          {/* Error */}
          {camState === "error" && (
            <div className="flex flex-col items-center gap-4 py-12 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <XCircle size={28} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Không thể truy cập camera</p>
                <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
              </div>
              <button onClick={startCamera}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors">
                <RotateCcw size={14} /> Thử lại
              </button>
            </div>
          )}

          {/* Camera active / paused — qr reader div always mounted when not idle/requesting/error */}
          <div className={cn(
            "relative",
            (camState === "idle" || camState === "requesting" || camState === "error") && "hidden"
          )}>
            {/* html5-qrcode renders video into this div */}
            <div id={READER_ID} className="w-full p-4" />

            {/* Status pill */}
            {camState === "active" && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium pointer-events-none z-10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Đang quét...
              </div>
            )}

            {/* Not-found toast */}
            {notFoundMsg && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/90 text-white text-sm font-medium shadow-lg backdrop-blur-sm whitespace-nowrap pointer-events-none">
                <AlertTriangle size={14} />
                {notFoundMsg}
              </div>
            )}

            {/* Paused overlay + result card */}
            {camState === "paused" && pendingScan && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center p-4 z-20">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-100 bg-green-50">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {pendingScan.item.productName}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                    <span>SKU: <span className="font-mono text-slate-700">{pendingScan.item.sku}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Tồn HT: <span className="font-semibold text-slate-700">{pendingScan.item.systemQty} {pendingScan.item.unit}</span></span>
                  </div>

                  {/* Inputs */}
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-slate-600 w-20 flex-shrink-0">Số lượng</label>
                      <div className="flex flex-1 rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
                        <input
                          type="number" min={0} autoFocus
                          value={pendingScan.qty}
                          onChange={(e) => setPendingScan((p) => p ? { ...p, qty: Math.max(0, Number(e.target.value)) } : null)}
                          className="flex-1 px-3 py-2 text-sm outline-none"
                        />
                        <span className="px-3 text-xs text-slate-400 bg-slate-50 flex items-center border-l border-slate-100">
                          {pendingScan.item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-slate-600 w-20 flex-shrink-0">Ghi chú</label>
                      <input
                        type="text" placeholder="Tuỳ chọn..."
                        value={pendingScan.note}
                        onChange={(e) => setPendingScan((p) => p ? { ...p, note: e.target.value } : null)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 px-4 pb-4">
                    <button onClick={confirmScan}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold"
                            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                      <CheckCircle2 size={15} /> Xác nhận
                    </button>
                    <button onClick={skipScan}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">
                      <ScanLine size={15} /> Quét lại
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stop button */}
            {(camState === "active" || camState === "paused") && (
              <div className="flex justify-center pb-4">
                <button onClick={stopCamera}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors">
                  <CameraOff size={15} /> Dừng camera
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Scan history ── */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
              <Clock size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Vừa quét ({history.length})
              </span>
            </div>
            <ul className="divide-y divide-slate-50">
              {history.map((entry, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Package size={15} className="text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{entry.item.productName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{entry.item.sku}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-slate-800">
                      {entry.qty} <span className="text-xs font-normal text-slate-400">{entry.item.unit}</span>
                    </span>
                    <DiffBadge diff={entry.diff} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
      {modal}
    </>
  );
}
