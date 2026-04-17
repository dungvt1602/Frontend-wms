"use client";

import { createPortal } from "react-dom";
import { X, Phone, Mail, MapPin, Package, ShoppingCart, CreditCard, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Supplier } from "../types";

function fmtDebt(n: number): string {
  if (n === 0) return "Không có nợ";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
}

interface Props {
  supplier: Supplier;
  onClose: () => void;
  onEdit: () => void;
}

export default function SupplierDetailModal({ supplier: s, onClose, onEdit }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(15,23,42,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        style={{ animation: "modalIn .18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* top accent bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)" }} />

        {/* header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 flex-shrink-0">
          {/* avatar */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg font-bold"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
          >
            {s.name.charAt(0)}
          </div>

          {/* name + id */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">{s.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{s.id}</p>
          </div>

          {/* status badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0",
              s.status === "active"
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-slate-500 bg-slate-100 border-slate-200"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                s.status === "active" ? "bg-emerald-500" : "bg-slate-400"
              )}
            />
            {s.status === "active" ? "Đang hợp tác" : "Tạm ngừng"}
          </span>

          {/* close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Section: Thông tin liên hệ */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Thông tin liên hệ
            </h3>
            <div className="rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                {/* Người liên hệ */}
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Người liên hệ</p>
                  <p className="text-sm font-medium text-slate-800">{s.contact}</p>
                </div>

                {/* Số điện thoại */}
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Số điện thoại</p>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-indigo-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-slate-800">{s.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 divide-x divide-slate-100 grid grid-cols-2">
                {/* Email */}
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Email</p>
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-indigo-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-slate-800 truncate">{s.email || "—"}</p>
                  </div>
                </div>

                {/* placeholder to keep grid */}
                <div className="px-4 py-3" />
              </div>

              {/* Địa chỉ — full width */}
              <div className="border-t border-slate-100 px-4 py-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Địa chỉ</p>
                <div className="flex items-start gap-1.5">
                  <MapPin size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-slate-800">{s.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Thống kê */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Thống kê
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Mặt hàng */}
              <div className="rounded-2xl border border-slate-200/80 shadow-sm px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Package size={12} className="text-indigo-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-600">Mặt hàng</p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {s.totalProducts}
                  <span className="text-xs font-normal text-slate-400 ml-1">SP</span>
                </p>
              </div>

              {/* Đơn hàng */}
              <div className="rounded-2xl border border-slate-200/80 shadow-sm px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShoppingCart size={12} className="text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-600">Đơn hàng</p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {s.totalOrders}
                  <span className="text-xs font-normal text-slate-400 ml-1">đơn</span>
                </p>
              </div>

              {/* Công nợ */}
              <div className="rounded-2xl border border-slate-200/80 shadow-sm px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", s.debtAmount > 0 ? "bg-red-50" : "bg-slate-100")}>
                    <CreditCard size={12} className={s.debtAmount > 0 ? "text-red-500" : "text-slate-400"} />
                  </div>
                  <p className="text-xs font-semibold text-slate-600">Công nợ</p>
                </div>
                <p className={cn("text-sm font-bold leading-tight", s.debtAmount > 0 ? "text-red-500" : "text-slate-400")}>
                  {fmtDebt(s.debtAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Đánh giá & Nhóm hàng */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Đánh giá &amp; Nhóm hàng
            </h3>
            <div className="rounded-2xl border border-slate-200/80 shadow-sm px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {([1, 2, 3, 4, 5] as const).map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i <= s.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">{s.rating}/5 sao</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {s.category}
              </span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <button
            onClick={onEdit}
            className="flex-1 h-10 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-300 bg-white hover:bg-indigo-50 transition-colors"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
          >
            Đóng
          </button>
        </div>
      </div>

      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
}
