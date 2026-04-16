"use client";

import { useState } from "react";
import {
  Building2, Phone, Mail, Star,
  MoreHorizontal, Pencil, Trash2, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import type { Supplier } from "../types";

const PAGE_SIZE = 8;

const categoryColors: Record<string, string> = {
  "Điện tử":  "bg-blue-50 text-blue-700",
  "Phụ kiện": "bg-purple-50 text-purple-700",
  "Linh kiện":"bg-orange-50 text-orange-700",
};

function fmtDebt(n: number) {
  if (n === 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  );
}

interface Props {
  items: Supplier[];
  total: number;
  page: number;
  onPage: (p: number) => void;
}

export default function SupplierTable({ items, total, page, onPage }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated  = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 w-[100px]">Mã NCC</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Nhà cung cấp</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Nhóm hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Liên hệ</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Mặt hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Đơn hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Công nợ</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Đánh giá</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 w-[50px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16 text-slate-400">
                  <Building2 size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Không tìm thấy nhà cung cấp nào</p>
                </td>
              </tr>
            ) : paginated.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group">

                {/* Mã */}
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">{s.id}</td>

                {/* Tên + địa chỉ */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                         style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 whitespace-nowrap">{s.name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{s.address}</p>
                    </div>
                  </div>
                </td>

                {/* Nhóm hàng */}
                <td className="px-5 py-3.5">
                  <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", categoryColors[s.category])}>
                    {s.category}
                  </span>
                </td>

                {/* Liên hệ */}
                <td className="px-5 py-3.5">
                  <p className="text-xs font-medium text-slate-700 whitespace-nowrap">{s.contact}</p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Phone size={9} /> {s.phone}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Mail size={9} /> {s.email}
                    </span>
                  </div>
                </td>

                {/* Mặt hàng */}
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">
                  {s.totalProducts}
                  <span className="text-xs font-normal text-slate-400 ml-1">SP</span>
                </td>

                {/* Đơn hàng */}
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">
                  {s.totalOrders}
                  <span className="text-xs font-normal text-slate-400 ml-1">đơn</span>
                </td>

                {/* Công nợ */}
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "text-xs font-semibold",
                    s.debtAmount > 0 ? "text-red-500" : "text-slate-400"
                  )}>
                    {fmtDebt(s.debtAmount)}
                  </span>
                </td>

                {/* Đánh giá */}
                <td className="px-5 py-3.5">
                  <StarRating rating={s.rating} />
                </td>

                {/* Trạng thái */}
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                    s.status === "active"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-slate-500 bg-slate-100 border-slate-200"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full",
                      s.status === "active" ? "bg-emerald-500" : "bg-slate-400")} />
                    {s.status === "active" ? "Đang hợp tác" : "Tạm ngừng"}
                  </span>
                </td>

                {/* Menu */}
                <td className="px-5 py-3.5 relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {openMenu === s.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-8 top-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1 overflow-hidden">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                          <Eye size={13} /> Xem chi tiết
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                          <Pencil size={13} /> Chỉnh sửa
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} /> Xoá
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
            </span>{" "}
            / <span className="font-medium text-slate-700">{total}</span> nhà cung cấp
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
}
