"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockItem, InventoryLog } from "../types";

const WAREHOUSES = ["Kho A", "Kho B", "Kho C"];

interface Props {
  items: StockItem[];
  onClose: () => void;
  onLog: (log: InventoryLog) => void;
}

export default function TransferStockModal({ items, onClose, onLog }: Props) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [fromWh,     setFromWh]     = useState("Kho A");
  const [toWh,       setToWh]       = useState("Kho B");
  const [qty,        setQty]        = useState("");
  const [note,       setNote]       = useState("");
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);

  const selected  = items.find((i) => i.id === selectedId);
  const toOptions = WAREHOUSES.filter((w) => w !== fromWh);

  const validate = () => {
    const err: Record<string, string> = {};
    if (fromWh === toWh) err.toWh = "Kho đích phải khác kho nguồn";
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0)
      err.qty = "Vui lòng nhập số lượng hợp lệ";
    if (selected && Number(qty) > selected.current)
      err.qty = `Vượt quá tồn kho hiện tại (${selected.current})`;
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    const now = new Date();
    const ts  = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")} ${now.getDate().toString().padStart(2,"0")}/${(now.getMonth()+1).toString().padStart(2,"0")}/${now.getFullYear()}`;
    onLog({
      id:            crypto.randomUUID(),
      type:          "transfer",
      productId:     selected!.id,
      productName:   selected!.name,
      qty:           Number(qty),
      fromWarehouse: fromWh,
      toWarehouse:   toWh,
      reason:        "Chuyển kho nội bộ",
      note,
      createdAt:     ts,
      createdBy:     "Admin",
    });
    setTimeout(onClose, 1000);
  };

  /* Khi đổi fromWh, nếu toWh trùng thì tự chọn kho khác */
  const handleFromChange = (w: string) => {
    setFromWh(w);
    if (toWh === w) setToWh(WAREHOUSES.find((wh) => wh !== w) ?? "");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden"
        style={{ animation: "modalIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Chuyển kho nội bộ</h2>
            <p className="text-xs text-slate-400 mt-0.5">Di chuyển hàng hoá giữa các kho</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          {/* Chọn sản phẩm */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Sản phẩm <span className="text-red-400">*</span></label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className={selectCls}>
              {items.map((i) => (
                <option key={i.id} value={i.id}>{i.id} — {i.name}</option>
              ))}
            </select>
          </div>

          {/* Tồn kho hiện tại */}
          {selected && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <AlertTriangle size={13} className="text-slate-400 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                Tồn kho hiện tại:
                <span className="font-bold text-slate-900 ml-1">{selected.current} {selected.unit}</span>
                <span className="text-slate-400 ml-1">tại {selected.warehouse}</span>
              </p>
            </div>
          )}

          {/* Kho nguồn → Kho đích */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Chuyển từ → đến <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-2">
              <select
                value={fromWh}
                onChange={(e) => handleFromChange(e.target.value)}
                className={cn(selectCls, "flex-1")}
              >
                {WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
              </select>

              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <ArrowRight size={14} className="text-indigo-500" />
              </div>

              <select
                value={toWh}
                onChange={(e) => setToWh(e.target.value)}
                className={cn(selectCls, "flex-1", errors.toWh ? "border-red-300" : "")}
              >
                {toOptions.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            {errors.toWh && <p className="text-[11px] text-red-500">{errors.toWh}</p>}
          </div>

          {/* Số lượng */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Số lượng chuyển <span className="text-red-400">*</span></label>
            <input
              type="number"
              min={1}
              placeholder="Nhập số lượng..."
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className={cn(inputCls, errors.qty ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-indigo-400")}
            />
            {errors.qty && <p className="text-[11px] text-red-500">{errors.qty}</p>}
          </div>

          {/* Preview */}
          {selected && qty && !isNaN(Number(qty)) && Number(qty) > 0 && Number(qty) <= selected.current && (
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-center">
                <p className="text-[10px] text-red-400 font-medium">{fromWh} sau chuyển</p>
                <p className="text-lg font-bold text-red-600 mt-0.5">{selected.current - Number(qty)}</p>
                <p className="text-[10px] text-red-400">{selected.unit}</p>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <p className="text-[10px] text-emerald-500 font-medium">{toWh} sau nhận</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">+{Number(qty)}</p>
                <p className="text-[10px] text-emerald-400">{selected.unit}</p>
              </div>
            </div>
          )}

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Lý do chuyển kho..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all",
              saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60"
            )}
            style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" } : {}}
          >
            {saving ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang xử lý...</>
            ) : saved ? (
              <><Check size={15} /> Đã chuyển kho!</>
            ) : "Xác nhận chuyển kho"}
          </button>
        </div>
      </div>

      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
}

const inputCls = "w-full h-10 px-4 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none";
const selectCls = "w-full h-10 px-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer";
