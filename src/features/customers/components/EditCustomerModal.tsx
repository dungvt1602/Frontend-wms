"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "../types";

const TYPES: { value: Customer["type"]; label: string }[] = [
  { value: "retail",     label: "Lẻ"           },
  { value: "wholesale",  label: "Sỉ"           },
  { value: "enterprise", label: "Doanh nghiệp" },
];

interface Props {
  customer: Customer;
  onClose: () => void;
  onSaved: (updated: Customer) => void;
}

export default function EditCustomerModal({ customer, onClose, onSaved }: Props) {
  const [name,       setName]       = useState(customer.name);
  const [contact,    setContact]    = useState(customer.contact);
  const [phone,      setPhone]      = useState(customer.phone);
  const [email,      setEmail]      = useState(customer.email);
  const [address,    setAddress]    = useState(customer.address);
  const [type,       setType]       = useState<Customer["type"]>(customer.type);
  const [status,     setStatus]     = useState<"active" | "inactive">(customer.status);
  const [debtAmount, setDebtAmount] = useState<number>(customer.debtAmount);
  const [note,       setNote]       = useState(customer.note ?? "");
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim())    err.name    = "Vui lòng nhập tên khách hàng";
    if (!contact.trim()) err.contact = "Vui lòng nhập người liên hệ";
    if (!phone.trim())   err.phone   = "Vui lòng nhập số điện thoại";
    if (!address.trim()) err.address = "Vui lòng nhập địa chỉ";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);

    const updated: Customer = {
      ...customer,
      name:       name.trim(),
      contact:    contact.trim(),
      phone:      phone.trim(),
      email:      email.trim(),
      address:    address.trim(),
      type,
      status,
      debtAmount,
      note:       note.trim() || undefined,
    };

    onSaved(updated);
    setTimeout(onClose, 800);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
        style={{ animation: "modalIn .18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* top accent */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)" }} />

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Chỉnh sửa khách hàng</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{customer.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Tên khách hàng */}
          <div className="space-y-1.5">
            <label className={lbl}>Tên khách hàng <span className="text-red-400">*</span></label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn An / Công ty ABC"
              className={cn(inp, errors.name ? errB : okB)}
            />
            {errors.name && <p className={em}>{errors.name}</p>}
          </div>

          {/* Người liên hệ + SĐT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={lbl}>Người liên hệ <span className="text-red-400">*</span></label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Họ tên..."
                className={cn(inp, errors.contact ? errB : okB)}
              />
              {errors.contact && <p className={em}>{errors.contact}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Số điện thoại <span className="text-red-400">*</span></label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="SĐT liên hệ..."
                className={cn(inp, errors.phone ? errB : okB)}
              />
              {errors.phone && <p className={em}>{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className={lbl}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className={cn(inp, okB)}
            />
          </div>

          {/* Địa chỉ */}
          <div className="space-y-1.5">
            <label className={lbl}>Địa chỉ <span className="text-red-400">*</span></label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ khách hàng..."
              className={cn(inp, errors.address ? errB : okB)}
            />
            {errors.address && <p className={em}>{errors.address}</p>}
          </div>

          {/* Công nợ */}
          <div className="space-y-1.5">
            <label className={lbl}>Công nợ (₫)</label>
            <input
              type="number"
              min={0}
              value={debtAmount}
              onChange={(e) => setDebtAmount(Number(e.target.value))}
              placeholder="0"
              className={cn(inp, okB)}
            />
          </div>

          {/* Loại KH + Trạng thái */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={lbl}>Loại khách hàng</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      type === t.value
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Trạng thái</label>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setStatus("active")}
                  className={cn(
                    "h-9 rounded-xl text-xs font-semibold border transition-all px-3 text-left",
                    status === "active"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  Đang hoạt động
                </button>
                <button
                  onClick={() => setStatus("inactive")}
                  className={cn(
                    "h-9 rounded-xl text-xs font-semibold border transition-all px-3 text-left",
                    status === "inactive"
                      ? "bg-slate-100 border-slate-300 text-slate-600"
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  Tạm ngừng
                </button>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <label className={lbl}>Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thông tin bổ sung về khách hàng..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all",
              saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60"
            )}
            style={
              !saved
                ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }
                : {}
            }
          >
            {saving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Đang lưu...
              </>
            ) : saved ? (
              <>
                <Check size={15} /> Đã lưu!
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
}

const lbl = "block text-xs font-semibold text-slate-600";
const inp = "w-full h-10 px-4 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all";
const okB = "border-slate-200 focus:border-indigo-400";
const errB = "border-red-300 focus:border-red-400";
const em  = "text-[11px] text-red-500 mt-0.5";
