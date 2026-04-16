"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Thermometer, Zap, Wind, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Warehouse } from "../types";

const ALL_FEATURES = [
  { key: "Điều hoà",      icon: <Thermometer size={13} /> },
  { key: "Điện dự phòng", icon: <Zap size={13} />         },
  { key: "PCCC",          icon: <Wind size={13} />         },
  { key: "Camera 24/7",   icon: <Camera size={13} />       },
];

const STATUS_OPTIONS = [
  { value: "active",      label: "Đang hoạt động", cls: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { value: "maintenance", label: "Bảo trì",         cls: "border-amber-300  bg-amber-50  text-amber-700"   },
  { value: "inactive",    label: "Tạm ngừng",       cls: "border-slate-300  bg-slate-100 text-slate-600"   },
] as const;

interface Props {
  warehouse: Warehouse;
  onClose: () => void;
  onSave: (updated: Warehouse) => void;
}

export default function EditWarehouseModal({ warehouse, onClose, onSave }: Props) {
  const [name,      setName]      = useState(warehouse.name);
  const [address,   setAddress]   = useState(warehouse.address);
  const [manager,   setManager]   = useState(warehouse.manager);
  const [phone,     setPhone]     = useState(warehouse.phone);
  const [totalArea, setTotalArea] = useState(String(warehouse.totalArea));
  const [status,    setStatus]    = useState<Warehouse["status"]>(warehouse.status);
  const [features,  setFeatures]  = useState<string[]>(warehouse.features);
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  const toggleFeature = (f: string) =>
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim())    err.name    = "Vui lòng nhập tên kho";
    if (!address.trim()) err.address = "Vui lòng nhập địa chỉ";
    if (!manager.trim()) err.manager = "Vui lòng nhập tên quản lý";
    if (!totalArea || isNaN(Number(totalArea)) || Number(totalArea) <= 0)
      err.totalArea = "Diện tích không hợp lệ";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    onSave({
      ...warehouse,
      name:      name.trim(),
      address:   address.trim(),
      manager:   manager.trim(),
      phone:     phone.trim(),
      totalArea: Number(totalArea),
      status,
      features,
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
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden"
        style={{ animation: "modalIn .18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* top accent */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)" }} />

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Chỉnh sửa kho</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cập nhật thông tin {warehouse.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

          {/* Tên kho */}
          <div className="space-y-1.5">
            <label className={labelCls}>Tên kho <span className="text-red-400">*</span></label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Kho A"
              className={cn(inputCls, errors.name ? errBorder : okBorder)}
            />
            {errors.name && <p className={errMsg}>{errors.name}</p>}
          </div>

          {/* Địa chỉ */}
          <div className="space-y-1.5">
            <label className={labelCls}>Địa chỉ <span className="text-red-400">*</span></label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ kho..."
              className={cn(inputCls, errors.address ? errBorder : okBorder)}
            />
            {errors.address && <p className={errMsg}>{errors.address}</p>}
          </div>

          {/* Quản lý + SĐT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelCls}>Quản lý <span className="text-red-400">*</span></label>
              <input
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="Tên quản lý..."
                className={cn(inputCls, errors.manager ? errBorder : okBorder)}
              />
              {errors.manager && <p className={errMsg}>{errors.manager}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Số điện thoại</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="SĐT quản lý..."
                className={cn(inputCls, okBorder)}
              />
            </div>
          </div>

          {/* Diện tích */}
          <div className="space-y-1.5">
            <label className={labelCls}>Diện tích (m²) <span className="text-red-400">*</span></label>
            <input
              type="number"
              min={1}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="VD: 1200"
              className={cn(inputCls, errors.totalArea ? errBorder : okBorder, "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none")}
            />
            {errors.totalArea && <p className={errMsg}>{errors.totalArea}</p>}
          </div>

          {/* Trạng thái */}
          <div className="space-y-1.5">
            <label className={labelCls}>Trạng thái</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                    status === s.value
                      ? s.cls
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tiện ích */}
          <div className="space-y-1.5">
            <label className={labelCls}>Tiện ích / Thiết bị</label>
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map((f) => {
                const active = features.includes(f.key);
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleFeature(f.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all",
                      active
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {f.icon} {f.key}
                    {active && <Check size={11} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer */}
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
              <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang lưu...</>
            ) : saved ? (
              <><Check size={15} /> Đã cập nhật!</>
            ) : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
}

const labelCls = "block text-xs font-semibold text-slate-600";
const inputCls  = "w-full h-10 px-4 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all";
const okBorder  = "border-slate-200 focus:border-indigo-400";
const errBorder = "border-red-300 focus:border-red-400";
const errMsg    = "text-[11px] text-red-500 mt-0.5";
