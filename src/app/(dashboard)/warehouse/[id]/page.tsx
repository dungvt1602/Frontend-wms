"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Save, Check, Plus, Trash2, Pencil, X,
  Thermometer, Zap, Wind, Camera,
  CheckCircle2, AlertTriangle, LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WAREHOUSES } from "@/features/warehouse/data/mock";
import type { Warehouse, Zone } from "@/features/warehouse/types";

/* ── helpers ── */
function usagePct(used: number, slots: number) {
  return slots === 0 ? 0 : Math.round((used / slots) * 100);
}
function usageColor(pct: number) {
  if (pct >= 90) return "#ef4444";
  if (pct >= 70) return "#f59e0b";
  return "#6366f1";
}

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

const TEMP_OPTIONS = ["18–22°C", "20–25°C", "15–20°C", "Nhiệt độ thường"];

/* ── empty zone template ── */
let _zoneKey = 0;
const emptyZone = (warehouseId: string): Zone & { _isNew: boolean } => ({
  id: `${warehouseId}-NEW-${++_zoneKey}`,
  name: "",
  type: "",
  slots: 0,
  used: 0,
  temp: "20–25°C",
  _isNew: true,
});

/* ─────────────────────────────────────────────────────── */
export default function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const router    = useRouter();
  const initial   = WAREHOUSES.find((w) => w.id === id);
  if (!initial) notFound();

  /* ── info form state ── */
  const [name,      setName]      = useState(initial.name);
  const [address,   setAddress]   = useState(initial.address);
  const [manager,   setManager]   = useState(initial.manager);
  const [phone,     setPhone]     = useState(initial.phone);
  const [totalArea, setTotalArea] = useState(String(initial.totalArea));
  const [status,    setStatus]    = useState<Warehouse["status"]>(initial.status);
  const [features,  setFeatures]  = useState<string[]>(initial.features);

  /* ── zones state ── */
  const [zones,     setZones]     = useState<(Zone & { _isNew?: boolean })[]>(initial.zones);
  const [editingId, setEditingId] = useState<string | null>(null); // zone being inline-edited
  const [editDraft, setEditDraft] = useState<Partial<Zone>>({});

  /* ── save state ── */
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);

  /* ── feature toggle ── */
  const toggleFeature = (f: string) =>
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  /* ── zone actions ── */
  const startEditZone = (z: Zone) => {
    setEditingId(z.id);
    setEditDraft({ name: z.name, type: z.type, temp: z.temp, slots: z.slots, used: z.used });
  };
  const cancelEditZone = () => { setEditingId(null); setEditDraft({}); };
  const saveEditZone = (zoneId: string) => {
    setZones((prev) => prev.map((z) =>
      z.id === zoneId ? { ...z, ...editDraft, _isNew: false } : z
    ));
    setEditingId(null);
    setEditDraft({});
  };
  const deleteZone = (zoneId: string) =>
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
  const addZone = () => {
    const z = emptyZone(id);
    setZones((prev) => [...prev, z]);
    startEditZone(z);
  };

  /* ── validate & save info ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name      = "Vui lòng nhập tên kho";
    if (!address.trim()) e.address   = "Vui lòng nhập địa chỉ";
    if (!manager.trim()) e.manager   = "Vui lòng nhập tên quản lý";
    if (!totalArea || isNaN(Number(totalArea)) || Number(totalArea) <= 0)
                         e.totalArea = "Diện tích không hợp lệ";
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── zone stats ── */
  const totalSlots = zones.reduce((s, z) => s + (z.slots || 0), 0);
  const totalUsed  = zones.reduce((s, z) => s + (z.used  || 0), 0);
  const wPct       = usagePct(totalUsed, totalSlots);

  return (
    <div className="space-y-5">

      {/* Breadcrumb + header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
              <span
                className="hover:text-indigo-600 cursor-pointer transition-colors"
                onClick={() => router.push("/warehouse")}
              >
                Kho bãi
              </span>
              <span>/</span>
              <span className="text-slate-700 font-medium">{initial.name}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Chỉnh sửa {initial.name}</h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={cn(
            "flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold text-white transition-all",
            saved ? "bg-emerald-500" : "hover:opacity-90 disabled:opacity-60"
          )}
          style={!saved ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" } : {}}
        >
          {saving ? (<><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang lưu...</>)
          : saved  ? (<><Check size={15} /> Đã lưu!</>)
          : (<><Save size={15} /> Lưu thay đổi</>)}
        </button>
      </div>

      {/* ─────── Thông tin kho ─────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Thông tin kho</h2>
          <p className="text-xs text-slate-400 mt-0.5">Thông tin cơ bản và cấu hình kho bãi</p>
        </div>
        <div className="px-6 py-5 space-y-4">

          {/* Tên + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={lbl}>Tên kho <span className="text-red-400">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Kho A"
                className={cn(inp, infoErrors.name ? errB : okB)} />
              {infoErrors.name && <p className={em}>{infoErrors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Diện tích (m²) <span className="text-red-400">*</span></label>
              <input type="number" min={1} value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder="VD: 1200"
                className={cn(inp, infoErrors.totalArea ? errB : okB, "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none")} />
              {infoErrors.totalArea && <p className={em}>{infoErrors.totalArea}</p>}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="space-y-1.5">
            <label className={lbl}>Địa chỉ <span className="text-red-400">*</span></label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ kho..."
              className={cn(inp, infoErrors.address ? errB : okB)} />
            {infoErrors.address && <p className={em}>{infoErrors.address}</p>}
          </div>

          {/* Quản lý + SĐT */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={lbl}>Quản lý kho <span className="text-red-400">*</span></label>
              <input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Tên quản lý..."
                className={cn(inp, infoErrors.manager ? errB : okB)} />
              {infoErrors.manager && <p className={em}>{infoErrors.manager}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Số điện thoại</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="SĐT quản lý..."
                className={cn(inp, okB)} />
            </div>
          </div>

          {/* Trạng thái */}
          <div className="space-y-1.5">
            <label className={lbl}>Trạng thái hoạt động</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button key={s.value} onClick={() => setStatus(s.value)}
                  className={cn("flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                    status === s.value ? s.cls : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50")}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tiện ích */}
          <div className="space-y-1.5">
            <label className={lbl}>Tiện ích / Thiết bị trang bị</label>
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map((f) => {
                const active = features.includes(f.key);
                return (
                  <button key={f.key} onClick={() => toggleFeature(f.key)}
                    className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all",
                      active ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50")}>
                    {f.icon} {f.key} {active && <Check size={11} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─────── Quản lý khu vực ─────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Khu vực / Kệ hàng</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {zones.length} khu vực · {totalUsed}/{totalSlots} vị trí đã dùng
              {totalSlots > 0 && (
                <span className="ml-1 font-medium" style={{ color: usageColor(wPct) }}>({wPct}%)</span>
              )}
            </p>
          </div>
          <button
            onClick={addZone}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 6px rgba(99,102,241,0.3)" }}
          >
            <Plus size={13} /> Thêm khu vực
          </button>
        </div>

        {zones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-slate-400">
            <LayoutGrid size={32} className="opacity-25 mb-3" />
            <p className="text-sm">Chưa có khu vực nào</p>
            <p className="text-xs mt-1 text-slate-300">Nhấn "+ Thêm khu vực" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Tên khu vực</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Loại hàng lưu trữ</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Nhiệt độ</th>
                  <th className="text-center text-xs font-semibold text-slate-400 px-4 py-3">Sức chứa</th>
                  <th className="text-center text-xs font-semibold text-slate-400 px-4 py-3">Đã dùng</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-[180px]">Công suất</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Tình trạng</th>
                  <th className="px-4 py-3 w-[80px]" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {zones.map((z) => {
                  const isEditing = editingId === z.id;
                  const pct = usagePct(z.used, z.slots);
                  const col = usageColor(pct);
                  const zSt =
                    z.used === 0 ? { label: "Trống",   cls: "text-slate-500 bg-slate-100 border-slate-200",      Icon: LayoutGrid    } :
                    pct >= 90    ? { label: "Gần đầy", cls: "text-red-700 bg-red-50 border-red-200",             Icon: AlertTriangle } :
                    pct >= 70    ? { label: "Khá đầy", cls: "text-amber-700 bg-amber-50 border-amber-200",       Icon: AlertTriangle } :
                                   { label: "Còn chỗ", cls: "text-emerald-700 bg-emerald-50 border-emerald-200", Icon: CheckCircle2  };

                  if (isEditing) {
                    return (
                      <tr key={z.id} className="bg-indigo-50/40 border-l-2 border-indigo-400">
                        {/* Tên */}
                        <td className="px-5 py-2.5">
                          <input
                            autoFocus
                            value={editDraft.name ?? ""}
                            onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                            placeholder="VD: Kệ 1"
                            className="w-full h-8 px-3 rounded-lg text-xs bg-white border border-indigo-300 outline-none focus:ring-2 focus:ring-indigo-100 font-mono font-bold text-indigo-600"
                          />
                        </td>
                        {/* Loại hàng */}
                        <td className="px-4 py-2.5">
                          <input
                            value={editDraft.type ?? ""}
                            onChange={(e) => setEditDraft((d) => ({ ...d, type: e.target.value }))}
                            placeholder="VD: Điện tử..."
                            className="w-full h-8 px-3 rounded-lg text-xs bg-white border border-slate-200 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                          />
                        </td>
                        {/* Nhiệt độ */}
                        <td className="px-4 py-2.5">
                          <select
                            value={editDraft.temp ?? "20–25°C"}
                            onChange={(e) => setEditDraft((d) => ({ ...d, temp: e.target.value }))}
                            className="w-full h-8 px-2 rounded-lg text-xs bg-white border border-slate-200 outline-none focus:border-indigo-300 cursor-pointer"
                          >
                            {TEMP_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        {/* Sức chứa */}
                        <td className="px-4 py-2.5">
                          <input
                            type="number" min={0}
                            value={editDraft.slots ?? 0}
                            onChange={(e) => setEditDraft((d) => ({ ...d, slots: Number(e.target.value) }))}
                            className="w-20 h-8 px-2 rounded-lg text-xs bg-white border border-slate-200 outline-none focus:border-indigo-300 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none mx-auto block"
                          />
                        </td>
                        {/* Đã dùng */}
                        <td className="px-4 py-2.5">
                          <input
                            type="number" min={0}
                            value={editDraft.used ?? 0}
                            onChange={(e) => setEditDraft((d) => ({ ...d, used: Number(e.target.value) }))}
                            className="w-20 h-8 px-2 rounded-lg text-xs bg-white border border-slate-200 outline-none focus:border-indigo-300 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none mx-auto block"
                          />
                        </td>
                        {/* Công suất (preview) */}
                        <td className="px-4 py-2.5 text-xs text-slate-400">—</td>
                        {/* Tình trạng (preview) */}
                        <td className="px-4 py-2.5 text-xs text-slate-400">—</td>
                        {/* Actions */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => saveEditZone(z.id)}
                              className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors">
                              <Check size={12} />
                            </button>
                            <button onClick={() => {
                              if (z._isNew) deleteZone(z.id);
                              else cancelEditZone();
                            }}
                              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors">
                              <X size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={z.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs font-bold text-indigo-600">{z.name || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{z.type || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Thermometer size={11} className="text-blue-400" /> {z.temp}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-700">{z.slots}</td>
                      <td className="px-4 py-3 text-center text-xs text-slate-500">{z.used}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: col }} />
                          </div>
                          <span className="text-xs font-semibold w-8 text-right shrink-0" style={{ color: col }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", zSt.cls)}>
                          <zSt.Icon size={11} /> {zSt.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditZone(z)}
                            className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => deleteZone(z.id)}
                            className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer summary */}
        {zones.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {zones.length} khu vực ·{" "}
              <span className="text-slate-600">{zones.filter((z) => z.used === 0).length}</span> trống ·{" "}
              <span className="text-amber-600">{zones.filter((z) => usagePct(z.used, z.slots) >= 90).length}</span> gần đầy
            </p>
            <p className="text-xs text-slate-400">
              Tổng: <span className="font-semibold text-slate-700">{totalUsed}/{totalSlots}</span> vị trí đã sử dụng
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

/* ── shared style tokens ── */
const lbl  = "block text-xs font-semibold text-slate-600";
const inp  = "w-full h-10 px-4 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all";
const okB  = "border-slate-200 focus:border-indigo-400";
const errB = "border-red-300 focus:border-red-400";
const em   = "text-[11px] text-red-500 mt-0.5";
