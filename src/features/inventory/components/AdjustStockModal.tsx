"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Minus, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockItem, InventoryLog } from "../types";
import { useConfirm } from "@/hooks/useConfirm";

const REASONS_INCREASE = ["Kiểm kê phát hiện thừa", "Hàng trả về", "Điều chỉnh hệ thống", "Khác"];
const REASONS_DECREASE = ["Kiểm kê phát hiện thiếu", "Hàng hỏng / hết hạn", "Mất mát", "Điều chỉnh hệ thống", "Khác"];

interface Props {
  items: StockItem[];
  onClose: () => void;
  onLog: (log: InventoryLog) => void;
}

export default function AdjustStockModal({ items, onClose, onLog }: Props) {
  const { confirm, modal } = useConfirm();
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [type,       setType]       = useState<"increase" | "decrease">("increase");
  const [qty,        setQty]        = useState("");
  const [reason,     setReason]     = useState("");
  const [note,       setNote]       = useState("");
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);

  const selected = items.find((i) => i.id === selectedId);
  const reasons  = type === "increase" ? REASONS_INCREASE : REASONS_DECREASE;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0)
      err.qty = "Vui lòng nhập số lượng hợp lệ";
    if (type === "decrease" && selected && Number(qty) > selected.current)
      err.qty = `Không thể giảm quá tồn kho hiện tại (${selected.current})`;
    if (!reason) err.reason = "Vui lòng chọn lý do";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const ok = await confirm({
      title: "Xác nhận điều chỉnh tồn kho?",
      description: "Thao tác này sẽ thay đổi số lượng tồn kho trong hệ thống.",
      variant: type === "decrease" ? "warning" : "primary",
      confirmLabel: "Xác nhận",
      cancelLabel: "Huỷ",
      details: [
        { label: "Sản phẩm",        value: selected?.name ?? "" },
        { label: "Loại điều chỉnh", value: type === "increase" ? "Tăng tồn kho" : "Giảm tồn kho", highlight: true },
        { label: "Số lượng",        value: `${qty} ${selected?.unit ?? ""}`, highlight: true },
        { label: "Lý do",           value: reason },
      ],
    });
    if (!ok) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    const now = new Date();
    const ts  = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")} ${now.getDate().toString().padStart(2,"0")}/${(now.getMonth()+1).toString().padStart(2,"0")}/${now.getFullYear()}`;
    onLog({
      id:          crypto.randomUUID(),
      type:        type === "increase" ? "adjust_increase" : "adjust_decrease",
      productId:   selected!.id,
      productName: selected!.name,
      qty:         Number(qty),
      warehouse:   selected!.warehouse,
      reason,
      note,
      createdAt:   ts,
      createdBy:   "Admin",
    });
    setTimeout(onClose, 1000);
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
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Điều chỉnh tồn kho</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cộng / trừ số lượng do kiểm kê hoặc sự cố</p>
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
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={selectCls}
            >
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

          {/* Loại điều chỉnh */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Loại điều chỉnh <span className="text-red-400">*</span></label>
            <div className="flex gap-2">
              <button
                onClick={() => { setType("increase"); setReason(""); }}
                className={cn(
                  "flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all",
                  type === "increase"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                )}
              >
                <Plus size={13} /> Tăng tồn kho
              </button>
              <button
                onClick={() => { setType("decrease"); setReason(""); }}
                className={cn(
                  "flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all",
                  type === "decrease"
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                )}
              >
                <Minus size={13} /> Giảm tồn kho
              </button>
            </div>
          </div>

          {/* Số lượng */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Số lượng <span className="text-red-400">*</span></label>
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

          {/* Lý do */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Lý do <span className="text-red-400">*</span></label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={cn(selectCls, errors.reason ? "border-red-300" : "")}
            >
              <option value="">— Chọn lý do —</option>
              {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.reason && <p className="text-[11px] text-red-500">{errors.reason}</p>}
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Mô tả thêm nếu cần..."
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
            style={!saved ? { background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" } : {}}
          >
            {saving ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang lưu...</>
            ) : saved ? (
              <><Check size={15} /> Đã điều chỉnh!</>
            ) : "Xác nhận điều chỉnh"}
          </button>
        </div>
      </div>

      {modal}
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
}

const inputCls = "w-full h-10 px-4 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none";
const selectCls = "w-full h-10 px-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer";
