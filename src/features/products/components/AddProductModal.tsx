"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Package, Tag, DollarSign, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Điện tử", "Phụ kiện", "Linh kiện"];
const UNITS      = ["Cái", "Thanh", "Hộp", "Bộ", "Chiếc", "Cuộn"];

interface FormState {
  id: string;
  name: string;
  category: string;
  unit: string;
  buyPrice: string;
  sellPrice: string;
  supplier: string;
  status: "active" | "inactive";
}

const EMPTY: FormState = {
  id: "", name: "", category: "Điện tử", unit: "Cái",
  buyPrice: "", sellPrice: "", supplier: "", status: "active",
};

interface Props {
  onClose: () => void;
  onSave?: (product: FormState) => void;
}

export default function AddProductModal({ onClose, onSave }: Props) {
  const [form,    setForm]    = useState<FormState>(EMPTY);
  const [errors,  setErrors]  = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const err: typeof errors = {};
    if (!form.id.trim())        err.id        = "Vui lòng nhập mã sản phẩm";
    if (!form.name.trim())      err.name      = "Vui lòng nhập tên sản phẩm";
    if (!form.buyPrice.trim())  err.buyPrice  = "Vui lòng nhập giá nhập";
    if (!form.sellPrice.trim()) err.sellPrice = "Vui lòng nhập giá bán";
    if (!form.supplier.trim())  err.supplier  = "Vui lòng nhập nhà cung cấp";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    onSave?.(form);
    setTimeout(onClose, 1000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden"
        style={{ animation: "modalIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5,#818cf8)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Thêm sản phẩm mới</h2>
            <p className="text-xs text-slate-400 mt-0.5">Điền thông tin để thêm vào danh mục</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Mã SP + Tên */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mã sản phẩm" error={errors.id} required>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="VD: SP013"
                  value={form.id}
                  onChange={set("id")}
                  className={inputCls(!!errors.id)}
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </Field>

            <Field label="Danh mục" error={errors.category}>
              <select value={form.category} onChange={set("category")} className={selectCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Tên sản phẩm */}
          <Field label="Tên sản phẩm" error={errors.name} required>
            <div className="relative">
              <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="VD: Laptop Dell XPS 15"
                value={form.name}
                onChange={set("name")}
                className={inputCls(!!errors.name)}
                style={{ paddingLeft: "2.25rem" }}
              />
            </div>
          </Field>

          {/* Giá nhập + Giá bán */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giá nhập (₫)" error={errors.buyPrice} required>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="VD: 28,000,000"
                  value={form.buyPrice}
                  onChange={set("buyPrice")}
                  className={inputCls(!!errors.buyPrice)}
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </Field>

            <Field label="Giá bán (₫)" error={errors.sellPrice} required>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="VD: 32,500,000"
                  value={form.sellPrice}
                  onChange={set("sellPrice")}
                  className={inputCls(!!errors.sellPrice)}
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </Field>
          </div>

          {/* Đơn vị + Nhà cung cấp */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Đơn vị tính" error={errors.unit}>
              <select value={form.unit} onChange={set("unit")} className={selectCls}>
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </Field>

            <Field label="Nhà cung cấp" error={errors.supplier} required>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="VD: Dell Vietnam"
                  value={form.supplier}
                  onChange={set("supplier")}
                  className={inputCls(!!errors.supplier)}
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </Field>
          </div>

          {/* Trạng thái */}
          <Field label="Trạng thái kinh doanh">
            <div className="flex gap-2">
              {(["active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                  className={cn(
                    "flex-1 h-9 rounded-xl text-xs font-medium border transition-all",
                    form.status === s
                      ? s === "active"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-slate-100 border-slate-300 text-slate-600"
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1.5",
                    s === "active" ? "bg-emerald-500" : "bg-slate-400")} />
                  {s === "active" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                </button>
              ))}
            </div>
          </Field>

        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
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
              "flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2",
              saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60"
            )}
            style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" } : {}}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Đang lưu...
              </>
            ) : saved ? (
              <>
                <Check size={15} />
                Đã thêm!
              </>
            ) : (
              "Thêm sản phẩm"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ── helpers ── */
function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (hasErr: boolean) => cn(
  "w-full h-10 pr-4 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none transition-all",
  "focus:bg-white focus:ring-2 focus:ring-indigo-100",
  hasErr
    ? "border-red-300 focus:border-red-400"
    : "border-slate-200 focus:border-indigo-400"
);

const selectCls = cn(
  "w-full h-10 px-3 rounded-xl text-sm bg-slate-50 border border-slate-200",
  "text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
);
