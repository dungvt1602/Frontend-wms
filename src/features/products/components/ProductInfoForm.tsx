"use client";

import { Package, Tag, DollarSign, Building2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "../types";

const CATEGORIES = ["Điện tử", "Phụ kiện", "Linh kiện"];
const UNITS      = ["Cái", "Thanh", "Hộp", "Bộ", "Chiếc", "Cuộn"];

interface Props {
  form: ProductDetail;
  onChange: (field: keyof ProductDetail, value: string) => void;
}

export default function ProductInfoForm({ form, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
      <h2 className="text-sm font-bold text-slate-900">Thông tin sản phẩm</h2>

      {/* Mã SP + Danh mục */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Mã sản phẩm">
          <div className="relative">
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={form.id}
              readOnly
              className="w-full h-10 pl-9 pr-4 rounded-xl text-sm bg-slate-100 border border-slate-200 text-slate-500 outline-none cursor-not-allowed"
            />
          </div>
        </Field>

        <Field label="Danh mục">
          <select
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className={selectCls}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {/* Tên sản phẩm */}
      <Field label="Tên sản phẩm">
        <div className="relative">
          <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={inputCls}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
      </Field>

      {/* Giá nhập + Giá bán */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Giá nhập (₫)">
          <div className="relative">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={form.buyPrice}
              onChange={(e) => onChange("buyPrice", e.target.value)}
              className={inputCls}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
        </Field>

        <Field label="Giá bán (₫)">
          <div className="relative">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={form.sellPrice}
              onChange={(e) => onChange("sellPrice", e.target.value)}
              className={inputCls}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
        </Field>
      </div>

      {/* Đơn vị + Nhà cung cấp */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Đơn vị tính">
          <select
            value={form.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            className={selectCls}
          >
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>

        <Field label="Nhà cung cấp">
          <div className="relative">
            <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => onChange("supplier", e.target.value)}
              className={inputCls}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
        </Field>
      </div>

      {/* Mô tả */}
      <Field label="Mô tả">
        <div className="relative">
          <FileText size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <textarea
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={3}
            placeholder="Nhập mô tả sản phẩm..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
          />
        </div>
      </Field>

      {/* Trạng thái */}
      <Field label="Trạng thái kinh doanh">
        <div className="flex gap-2">
          {(["active", "inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange("status", s)}
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
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-10 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
const selectCls = "w-full h-10 px-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer";
