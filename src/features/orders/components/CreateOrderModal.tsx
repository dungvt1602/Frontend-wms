"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  X, Plus, Trash2, Check, PackageCheck, PackageMinus,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderItem, OrderType } from "../types";

/* ── product catalogue (mirrors inventory mock) ── */
const PRODUCTS = [
  { id: "SP001", name: "Laptop Dell XPS 15",          unit: "Cái",   price: 28_000_000 },
  { id: "SP002", name: "Màn hình LG 27\" 4K",         unit: "Cái",   price: 12_000_000 },
  { id: "SP003", name: "Bàn phím cơ Keychron K8",     unit: "Cái",   price: 1_950_000  },
  { id: "SP004", name: "Chuột Logitech MX Master 3",  unit: "Cái",   price: 1_500_000  },
  { id: "SP005", name: "SSD Samsung 970 EVO 1TB",     unit: "Cái",   price: 2_600_000  },
  { id: "SP006", name: "RAM Kingston 16GB DDR5",      unit: "Thanh", price: 1_100_000  },
  { id: "SP007", name: "Tai nghe Sony WH-1000XM5",   unit: "Cái",   price: 7_500_000  },
  { id: "SP008", name: "Webcam Logitech C920",        unit: "Cái",   price: 1_900_000  },
  { id: "SP009", name: "Hub USB-C Anker 7-in-1",     unit: "Cái",   price: 680_000    },
  { id: "SP010", name: "Card đồ họa RTX 4070",       unit: "Cái",   price: 15_000_000 },
  { id: "SP011", name: "Ổ cứng WD Blue 2TB",         unit: "Cái",   price: 1_650_000  },
  { id: "SP012", name: "Bộ sạc Anker 65W GaN",       unit: "Cái",   price: 580_000    },
];

const WAREHOUSES = ["Kho A", "Kho B", "Kho C"];

const fmt = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

/* ── line-item row ── */
interface LineItem {
  _key: number;
  productId: string;
  productName: string;
  unit: string;
  qty: string;
  unitPrice: string;
}

let _key = 0;
const newLine = (): LineItem => ({
  _key: ++_key, productId: "", productName: "", unit: "", qty: "1", unitPrice: "",
});

interface Props {
  onClose: () => void;
  onCreated: (order: Order) => void;
}

export default function CreateOrderModal({ onClose, onCreated }: Props) {
  const [type,          setType]          = useState<OrderType>("import");
  /* nhập kho */
  const [supplier,      setSupplier]      = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  /* xuất kho */
  const [customer,      setCustomer]      = useState("");
  const [phone,         setPhone]         = useState("");
  const [address,       setAddress]       = useState("");
  /* chung */
  const [warehouse,     setWarehouse]     = useState("Kho A");
  const [note,          setNote]          = useState("");
  const [lines,         setLines]         = useState<LineItem[]>([newLine()]);
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);

  /* ── total ── */
  const total = lines.reduce((s, l) => {
    const q = Number(l.qty)       || 0;
    const p = Number(l.unitPrice) || 0;
    return s + q * p;
  }, 0);

  /* ── line helpers ── */
  const setLine = (key: number, patch: Partial<LineItem>) =>
    setLines((prev) => prev.map((l) => (l._key === key ? { ...l, ...patch } : l)));

  const pickProduct = (key: number, productId: string) => {
    const p = PRODUCTS.find((p) => p.id === productId);
    if (!p) return;
    setLine(key, { productId: p.id, productName: p.name, unit: p.unit, unitPrice: String(p.price) });
  };

  const addLine = () => setLines((prev) => [...prev, newLine()]);
  const removeLine = (key: number) =>
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l._key !== key) : prev));

  /* ── validate ── */
  const validate = () => {
    const err: Record<string, string> = {};
    if (type === "import") {
      if (!supplier.trim())      err.supplier = "Vui lòng nhập tên nhà cung cấp";
    } else {
      if (!customer.trim())      err.customer = "Vui lòng nhập tên khách hàng";
      if (!address.trim())       err.address  = "Vui lòng nhập địa chỉ giao hàng";
    }
    lines.forEach((l, i) => {
      if (!l.productId)          err[`prod_${i}`] = "Chọn sản phẩm";
      if (!l.qty || Number(l.qty) <= 0) err[`qty_${i}`] = "Số lượng không hợp lệ";
      if (!l.unitPrice || Number(l.unitPrice) <= 0) err[`price_${i}`] = "Đơn giá không hợp lệ";
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ── submit ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);

    const now = new Date();
    const dd  = now.getDate().toString().padStart(2, "0");
    const mm  = (now.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = now.getFullYear();
    const rand = Math.floor(Math.random() * 900) + 100;
    const newId = type === "import"
      ? `IMP-${yyyy}-${rand}`
      : `ORD-${yyyy}-${rand}`;

    const items: OrderItem[] = lines.map((l) => ({
      productId: l.productId,
      productName: l.productName,
      qty: Number(l.qty),
      unitPrice: Number(l.unitPrice),
    }));

    const order: Order = {
      id: newId, type,
      warehouse,
      items,
      createdAt: `${dd}/${mm}/${yyyy}`,
      status: "pending",
      paymentStatus: "unpaid",
      note: note || undefined,
      ...(type === "import"
        ? { supplier: supplier.trim(), supplierPhone: supplierPhone.trim() }
        : { customer: customer.trim(), phone: phone.trim(), address: address.trim() }),
    };

    onCreated(order);
    setTimeout(onClose, 900);
  };

  /* ── switch type ── */
  const switchType = (t: OrderType) => {
    setType(t);
    setErrors({});
  };

  const accentGrad = type === "import"
    ? "linear-gradient(90deg,#3b82f6,#2563eb)"
    : "linear-gradient(90deg,#8b5cf6,#7c3aed)";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ animation: "modalIn .18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* top bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: accentGrad }} />

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tạo đơn hàng mới</h2>
            <p className="text-xs text-slate-400 mt-0.5">Điền thông tin đơn nhập kho hoặc xuất kho</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* ── loại đơn ── */}
          <div className="flex gap-2">
            <button
              onClick={() => switchType("import")}
              className={cn(
                "flex-1 h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all",
                type === "import"
                  ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
              )}
            >
              <PackageCheck size={15} /> Nhập kho
            </button>
            <button
              onClick={() => switchType("export")}
              className={cn(
                "flex-1 h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all",
                type === "export"
                  ? "bg-violet-50 border-violet-300 text-violet-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
              )}
            >
              <PackageMinus size={15} /> Xuất kho
            </button>
          </div>

          {/* ── partner info ── */}
          {type === "import" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelCls}>Nhà cung cấp <span className="text-red-400">*</span></label>
                <input
                  value={supplier} onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Tên nhà cung cấp..."
                  className={cn(inputCls, errors.supplier ? errBorder : okBorder)}
                />
                {errors.supplier && <p className={errMsg}>{errors.supplier}</p>}
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Số điện thoại</label>
                <input
                  value={supplierPhone} onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="SĐT nhà cung cấp..."
                  className={cn(inputCls, okBorder)}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Khách hàng <span className="text-red-400">*</span></label>
                  <input
                    value={customer} onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Tên khách hàng / đơn vị..."
                    className={cn(inputCls, errors.customer ? errBorder : okBorder)}
                  />
                  {errors.customer && <p className={errMsg}>{errors.customer}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Số điện thoại</label>
                  <input
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="SĐT khách hàng..."
                    className={cn(inputCls, okBorder)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Địa chỉ giao hàng <span className="text-red-400">*</span></label>
                <input
                  value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ giao hàng..."
                  className={cn(inputCls, errors.address ? errBorder : okBorder)}
                />
                {errors.address && <p className={errMsg}>{errors.address}</p>}
              </div>
            </>
          )}

          {/* ── kho ── */}
          <div className="space-y-1.5">
            <label className={labelCls}>
              {type === "import" ? "Kho nhập hàng" : "Kho xuất hàng"}
              <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <select
                value={warehouse} onChange={(e) => setWarehouse(e.target.value)}
                className={cn(selectCls, "pr-8")}
              >
                {WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* ── line items ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>
                Danh sách hàng hoá <span className="text-red-400">*</span>
              </label>
              <button
                onClick={addLine}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus size={13} /> Thêm dòng
              </button>
            </div>

            {/* table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-1">
              <span>Sản phẩm</span>
              <span className="text-center">Đơn vị</span>
              <span className="text-center">Số lượng</span>
              <span className="text-right">Đơn giá (₫)</span>
              <span />
            </div>

            <div className="space-y-2">
              {lines.map((l, i) => (
                <div
                  key={l._key}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-start"
                >
                  {/* product select */}
                  <div>
                    <div className="relative">
                      <select
                        value={l.productId}
                        onChange={(e) => pickProduct(l._key, e.target.value)}
                        className={cn(
                          selectCls, "pr-7 text-xs",
                          errors[`prod_${i}`] ? "border-red-300" : ""
                        )}
                      >
                        <option value="">— Chọn SP —</option>
                        {PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>{p.id} – {p.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    {errors[`prod_${i}`] && <p className={errMsg}>{errors[`prod_${i}`]}</p>}
                  </div>

                  {/* unit (read-only) */}
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-xs text-slate-500 font-medium">{l.unit || "—"}</span>
                  </div>

                  {/* qty */}
                  <div>
                    <input
                      type="number" min={1}
                      value={l.qty}
                      onChange={(e) => setLine(l._key, { qty: e.target.value })}
                      className={cn(
                        inputCls, "text-center",
                        errors[`qty_${i}`] ? errBorder : okBorder
                      )}
                    />
                    {errors[`qty_${i}`] && <p className={errMsg}>{errors[`qty_${i}`]}</p>}
                  </div>

                  {/* unit price */}
                  <div>
                    <input
                      type="number" min={0}
                      value={l.unitPrice}
                      onChange={(e) => setLine(l._key, { unitPrice: e.target.value })}
                      placeholder="0"
                      className={cn(
                        inputCls, "text-right",
                        errors[`price_${i}`] ? errBorder : okBorder
                      )}
                    />
                    {errors[`price_${i}`] && <p className={errMsg}>{errors[`price_${i}`]}</p>}
                  </div>

                  {/* remove */}
                  <button
                    onClick={() => removeLine(l._key)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* subtotals */}
            {lines.some((l) => l.productId && Number(l.qty) > 0 && Number(l.unitPrice) > 0) && (
              <div className="space-y-1 pt-1">
                {lines.filter((l) => l.productId && Number(l.qty) > 0 && Number(l.unitPrice) > 0).map((l) => (
                  <div key={l._key} className="flex justify-between text-xs text-slate-500 px-1">
                    <span className="truncate max-w-[280px]">{l.productName} × {l.qty}</span>
                    <span className="font-medium text-slate-700 ml-2 flex-shrink-0">
                      {fmt(Number(l.qty) * Number(l.unitPrice))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── note ── */}
          <div className="space-y-1.5">
            <label className={labelCls}>Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm cho đơn hàng..."
              value={note} onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>
        </div>

        {/* ── footer ── */}
        <div className="flex-shrink-0 border-t border-slate-100 bg-slate-50/70">
          {/* total row */}
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Tổng giá trị đơn hàng</span>
            <span
              className="text-lg font-bold"
              style={{ color: type === "import" ? "#2563eb" : "#7c3aed" }}
            >
              {fmt(total)}
            </span>
          </div>

          <div className="flex gap-2 px-6 py-3.5">
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
                  ? { background: type === "import"
                      ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                      : "linear-gradient(135deg,#8b5cf6,#7c3aed)",
                      boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }
                  : {}
              }
            >
              {saving ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang tạo...</>
              ) : saved ? (
                <><Check size={15} /> Đã tạo đơn!</>
              ) : (
                `Tạo đơn ${type === "import" ? "nhập kho" : "xuất kho"}`
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
}

const labelCls = "block text-xs font-semibold text-slate-600";
const inputCls  = "w-full h-10 px-3 rounded-xl text-sm bg-slate-50 border text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none";
const selectCls = "w-full h-10 px-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer appearance-none";
const okBorder  = "border-slate-200 focus:border-indigo-400";
const errBorder = "border-red-300 focus:border-red-400";
const errMsg    = "text-[11px] text-red-500 mt-0.5";
