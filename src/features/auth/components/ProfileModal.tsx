"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shield, Camera, Check, Lock, Eye, EyeOff, KeyRound, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "profile" | "password";

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [tab, setTab] = useState<Tab>("profile");

  /* ── Profile form ── */
  const [form, setForm] = useState({
    fullName: "Admin",
    email: "admin@wms.com",
    phone: "0901 234 567",
    role: "Quản trị viên",
  });

  /* ── Password form ── */
  const [pw, setPw] = useState({ old: "", new_: "", confirm: "" });
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwErrors,    setPwErrors]    = useState<{ old?: string; new_?: string; confirm?: string }>({});

  /* ── Shared state ── */
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [visible, setVisible] = useState(false);

  /* animate in/out */
  useEffect(() => {
    if (open) requestAnimationFrame(() => setVisible(true));
    else       setVisible(false);
  }, [open]);

  /* reset on close */
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTab("profile");
        setPw({ old: "", new_: "", confirm: "" });
        setPwErrors({});
        setSaved(false);
      }, 300);
    }
  }, [open]);

  /* Escape key */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  /* ── Handlers ── */
  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handlePwChange = (field: keyof typeof pw) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPw((p) => ({ ...p, [field]: e.target.value }));
      setPwErrors((p) => ({ ...p, [field]: undefined }));
    };

  const validatePw = () => {
    const e: typeof pwErrors = {};
    if (!pw.old.trim())           e.old     = "Vui lòng nhập mật khẩu hiện tại";
    if (!pw.new_.trim())          e.new_    = "Vui lòng nhập mật khẩu mới";
    else if (pw.new_.length < 6)  e.new_    = "Mật khẩu tối thiểu 6 ký tự";
    if (!pw.confirm.trim())       e.confirm = "Vui lòng xác nhận mật khẩu mới";
    else if (pw.confirm !== pw.new_) e.confirm = "Mật khẩu xác nhận không khớp";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (tab === "password" && !validatePw()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  /* ── Strength indicator (for new password) ── */
  const strength = (() => {
    const v = pw.new_;
    if (!v) return 0;
    let s = 0;
    if (v.length >= 6)  s++;
    if (v.length >= 10) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  })();
  const strengthLabel = ["", "Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"][strength];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.45)" }}
    >
      <div className="absolute inset-0" onClick={onClose} />

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
        <div className="flex justify-center pb-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              {form.fullName.charAt(0).toUpperCase()}
            </div>
            <button
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow border-2 border-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              <Camera size={11} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mx-6 mb-4 p-1 rounded-xl bg-slate-100">
          <button
            onClick={() => setTab("profile")}
            className={cn(
              "flex-1 h-8 rounded-lg text-xs font-semibold transition-all",
              tab === "profile"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Thông tin
          </button>
          <button
            onClick={() => setTab("password")}
            className={cn(
              "flex-1 h-8 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
              tab === "password"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <KeyRound size={11} />
            Đổi mật khẩu
          </button>
        </div>

        {/* ── Tab: Profile ── */}
        {tab === "profile" && (
          <div className="px-6 pb-6 space-y-4">

            {/* Full name */}
            <div>
              <label className={lbl}>Họ và tên</label>
              <div className="relative">
                <User size={14} className={icon} />
                <input type="text" value={form.fullName} onChange={handleChange("fullName")}
                  placeholder="Nhập họ và tên" className={cn(inp, "pl-9")} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={lbl}>Email</label>
              <div className="relative">
                <Mail size={14} className={icon} />
                <input type="email" value={form.email} onChange={handleChange("email")}
                  placeholder="Nhập email" className={cn(inp, "pl-9")} />
              </div>
            </div>

            {/* Phone + Role */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Số điện thoại</label>
                <div className="relative">
                  <Phone size={14} className={icon} />
                  <input type="tel" value={form.phone} onChange={handleChange("phone")}
                    placeholder="Số điện thoại" className={cn(inp, "pl-9")} />
                </div>
              </div>
              <div>
                <label className={lbl}>Vai trò</label>
                <div className="relative">
                  <Shield size={14} className={icon} />
                  <input type="text" value={form.role} readOnly
                    className="w-full h-10 pl-9 pr-3 rounded-xl text-sm bg-slate-100 border border-slate-200 text-slate-500 outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className={cancelBtn}>Huỷ</button>
              <SaveButton saving={saving} saved={saved} onClick={handleSave} label="Lưu thay đổi" />
            </div>
          </div>
        )}

        {/* ── Tab: Change Password ── */}
        {tab === "password" && (
          <div className="px-6 pb-6 space-y-4">

            {/* Old password */}
            <div>
              <label className={lbl}>Mật khẩu hiện tại <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={14} className={icon} />
                <input
                  type={showOld ? "text" : "password"}
                  value={pw.old}
                  onChange={handlePwChange("old")}
                  placeholder="Nhập mật khẩu hiện tại"
                  className={cn(inp, "pl-9 pr-10", pwErrors.old ? errB : "")}
                />
                <ToggleEye show={showOld} onToggle={() => setShowOld(v => !v)} />
              </div>
              {pwErrors.old && <p className={em}>{pwErrors.old}</p>}
            </div>

            {/* New password */}
            <div>
              <label className={lbl}>Mật khẩu mới <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={14} className={icon} />
                <input
                  type={showNew ? "text" : "password"}
                  value={pw.new_}
                  onChange={handlePwChange("new_")}
                  placeholder="Nhập mật khẩu mới"
                  className={cn(inp, "pl-9 pr-10", pwErrors.new_ ? errB : "")}
                />
                <ToggleEye show={showNew} onToggle={() => setShowNew(v => !v)} />
              </div>
              {/* Strength bar */}
              {pw.new_ && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all"
                        style={{ background: i <= strength ? strengthColor : "#e2e8f0" }} />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
              {pwErrors.new_ && <p className={em}>{pwErrors.new_}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className={lbl}>Xác nhận mật khẩu mới <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={14} className={icon} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={pw.confirm}
                  onChange={handlePwChange("confirm")}
                  placeholder="Nhập lại mật khẩu mới"
                  className={cn(
                    inp, "pl-9 pr-10",
                    pw.confirm && pw.confirm === pw.new_
                      ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100"
                      : pwErrors.confirm ? errB : ""
                  )}
                />
                <ToggleEye show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
              </div>
              {pw.confirm && pw.confirm === pw.new_ && !pwErrors.confirm && (
                <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
                  <Check size={11} /> Mật khẩu khớp
                </p>
              )}
              {pwErrors.confirm && <p className={em}>{pwErrors.confirm}</p>}
            </div>

            {/* Footer */}
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className={cancelBtn}>Huỷ</button>
              <SaveButton saving={saving} saved={saved} onClick={handleSave} label="Đổi mật khẩu" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function ToggleEye({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
    >
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );
}

function SaveButton({ saving, saved, onClick, label }: {
  saving: boolean; saved: boolean; onClick: () => void; label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving || saved}
      className={cn(
        "flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2",
        saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60"
      )}
      style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" } : {}}
    >
      {saving ? (
        <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang lưu...</>
      ) : saved ? (
        <><Check size={15} /> Đã lưu!</>
      ) : label}
    </button>
  );
}

/* ── Styles ── */
const lbl = "block text-xs font-semibold text-slate-600 mb-1.5";
const inp = "w-full h-10 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
const icon = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";
const errB = "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100";
const em   = "text-[11px] text-red-500 mt-1";
const cancelBtn = "flex-1 h-10 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors";
