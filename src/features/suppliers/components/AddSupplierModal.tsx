"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Supplier } from "../types";

const CATEGORIES = ["Điện tử", "Phụ kiện", "Linh kiện", "Khác"];

interface Props {
  onClose: () => void;
  onCreated: (s: Supplier) => void;
}

export default function AddSupplierModal({ onClose, onCreated }: Props) {
  const [name,     setName]     = useState("");
  const [contact,  setContact]  = useState("");
  const [phone,    setPhone]    = useState("");
  const [email,    setEmail]    = useState("");
  const [address,  setAddress]  = useState("");
  const [category, setCategory] = useState("Điện tử");
  const [status,   setStatus]   = useState<"active" | "inactive">("active");
  const [rating,   setRating]   = useState<1|2|3|4|5>(4);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim())    err.name    = "Vui lòng nhập tên nhà cung cấp";
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

    const id = `NCC${String(Date.now()).slice(-3)}`;
    onCreated({
      id, name: name.trim(), contact: contact.trim(),
      phone: phone.trim(), email: email.trim(),
      address: address.trim(), category,
      totalProducts: 0, totalOrders: 0, debtAmount: 0,
      status, rating,
    });
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
            <h2 className="text-base font-bold text-slate-900">Thêm nhà cung cấp</h2>
            <p className="text-xs text-slate-400 mt-0.5">Thêm đối tác cung cấp hàng hoá mới</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Tên NCC */}
          <div className="space-y-1.5">
            <label className={lbl}>Tên nhà cung cấp <span className="text-red-400">*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="VD: Dell Vietnam"
              className={cn(inp, errors.name ? errB : okB)} />
            {errors.name && <p className={em}>{errors.name}</p>}
          </div>

          {/* Người liên hệ + SĐT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={lbl}>Người liên hệ <span className="text-red-400">*</span></label>
              <input value={contact} onChange={(e) => setContact(e.target.value)}
                placeholder="Họ tên..."
                className={cn(inp, errors.contact ? errB : okB)} />
              {errors.contact && <p className={em}>{errors.contact}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Số điện thoại <span className="text-red-400">*</span></label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="SĐT liên hệ..."
                className={cn(inp, errors.phone ? errB : okB)} />
              {errors.phone && <p className={em}>{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className={lbl}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.com"
              className={cn(inp, okB)} />
          </div>

          {/* Địa chỉ */}
          <div className="space-y-1.5">
            <label className={lbl}>Địa chỉ <span className="text-red-400">*</span></label>
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ công ty..."
              className={cn(inp, errors.address ? errB : okB)} />
            {errors.address && <p className={em}>{errors.address}</p>}
          </div>

          {/* Nhóm hàng + Trạng thái */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={lbl}>Nhóm hàng</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      category === c
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50")}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Trạng thái</label>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setStatus("active")}
                  className={cn("h-9 rounded-xl text-xs font-semibold border transition-all px-3 text-left",
                    status === "active"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50")}>
                  Đang hợp tác
                </button>
                <button onClick={() => setStatus("inactive")}
                  className={cn("h-9 rounded-xl text-xs font-semibold border transition-all px-3 text-left",
                    status === "inactive"
                      ? "bg-slate-100 border-slate-300 text-slate-600"
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50")}>
                  Tạm ngừng
                </button>
              </div>
            </div>
          </div>

          {/* Đánh giá */}
          <div className="space-y-1.5">
            <label className={lbl}>Đánh giá ban đầu</label>
            <div className="flex items-center gap-1">
              {([1,2,3,4,5] as const).map((s) => (
                <button key={s} onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110">
                  <Star
                    size={22}
                    className={cn("transition-colors",
                      s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200")}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs text-slate-400">{rating}/5 sao</span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            Huỷ
          </button>
          <button onClick={handleSave} disabled={saving || saved}
            className={cn("flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all",
              saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60")}
            style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" } : {}}>
            {saving ? (<><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang tạo...</>)
            : saved  ? (<><Check size={15} /> Đã thêm!</>)
            : "Thêm nhà cung cấp"}
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
