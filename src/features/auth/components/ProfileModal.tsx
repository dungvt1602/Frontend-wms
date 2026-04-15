"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shield, Camera, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [form, setForm] = useState({
    fullName: "Admin",
    email: "admin@wms.com",
    phone: "0901 234 567",
    role: "Quản trị viên",
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [visible, setVisible] = useState(false);

  /* animate in/out */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    /* Backdrop */
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.45)" }}
    >
      {/* click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal card */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transition-all duration-300",
          visible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        )}
      >
        {/* Header stripe */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5,#818cf8)" }} />

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hồ sơ cá nhân</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chỉnh sửa thông tin tài khoản của bạn</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Avatar section */}
        <div className="flex justify-center pb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                 style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
              {form.fullName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-white border-2 border-white shadow flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
              <Camera size={11} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="px-6 pb-6 space-y-4">

          {/* Full name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Họ và tên</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={form.fullName}
                onChange={handleChange("fullName")}
                className="w-full h-10 pl-9 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full h-10 pl-9 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Nhập email"
              />
            </div>
          </div>

          {/* Phone + Role (2-col) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số điện thoại</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="Số điện thoại"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Vai trò</label>
              <div className="relative">
                <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={form.role}
                  readOnly
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-sm bg-slate-100 border border-slate-200 text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2",
                saved ? "bg-emerald-500" : "hover:opacity-90"
              )}
              style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" } : {}}
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Đang lưu...
                </>
              ) : saved ? (
                <>
                  <Check size={15} />
                  Đã lưu!
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
