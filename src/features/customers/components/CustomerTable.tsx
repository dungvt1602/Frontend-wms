"use client";

import { useState } from "react";
import { Phone, Mail, MoreHorizontal, Pencil, Trash2, Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import type { Customer } from "../types";

const PAGE_SIZE = 8;

const typeConfig: Record<
  Customer["type"],
  { label: string; className: string }
> = {
  retail:     { label: "Lẻ",           className: "bg-purple-50 text-purple-700 border-purple-100" },
  wholesale:  { label: "Sỉ",           className: "bg-blue-50 text-blue-700 border-blue-100"       },
  enterprise: { label: "Doanh nghiệp", className: "bg-indigo-50 text-indigo-700 border-indigo-100" },
};

function fmtMoney(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ ₫`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
}

function fmtDebt(n: number) {
  if (n === 0) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
}

interface Props {
  items: Customer[];
  total: number;
  page: number;
  onPage: (p: number) => void;
  onView?: (c: Customer) => void;
  onEdit?: (c: Customer) => void;
}

export default function CustomerTable({ items, total, page, onPage, onView, onEdit }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated  = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 w-[90px]">Mã KH</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Khách hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Loại KH</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Liên hệ</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Đơn hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Doanh thu</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Công nợ</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Ngày tham gia</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 w-[50px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16 text-slate-400">
                  <Users size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Không tìm thấy khách hàng nào</p>
                </td>
              </tr>
            ) : paginated.map((c) => {
              const debt = fmtDebt(c.debtAmount);
              const type = typeConfig[c.type];
              return (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">

                  {/* Mã KH */}
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">
                    {c.id}
                  </td>

                  {/* Khách hàng */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 whitespace-nowrap">{c.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{c.address}</p>
                      </div>
                    </div>
                  </td>

                  {/* Loại KH */}
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium border",
                        type.className
                      )}
                    >
                      {type.label}
                    </span>
                  </td>

                  {/* Liên hệ */}
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-slate-700 whitespace-nowrap">{c.contact}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Phone size={9} /> {c.phone}
                      </span>
                      {c.email && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Mail size={9} /> {c.email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Đơn hàng */}
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">
                    {c.totalOrders}
                    <span className="text-xs font-normal text-slate-400 ml-1">đơn</span>
                  </td>

                  {/* Doanh thu */}
                  <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">
                    {fmtMoney(c.totalSpent)}
                  </td>

                  {/* Công nợ */}
                  <td className="px-5 py-3.5">
                    {debt ? (
                      <span className="text-xs font-semibold text-red-500">{debt}</span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>

                  {/* Ngày tham gia */}
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {c.joinDate}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                        c.status === "active"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-slate-500 bg-slate-100 border-slate-200"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          c.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                        )}
                      />
                      {c.status === "active" ? "Đang hoạt động" : "Tạm ngừng"}
                    </span>
                  </td>

                  {/* Context menu */}
                  <td className="px-5 py-3.5 relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                    {openMenu === c.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-8 top-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1 overflow-hidden">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                            onClick={() => { setOpenMenu(null); onView?.(c); }}
                          >
                            <Eye size={13} /> Xem chi tiết
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                            onClick={() => { setOpenMenu(null); onEdit?.(c); }}
                          >
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
              );
            })}
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
            / <span className="font-medium text-slate-700">{total}</span> khách hàng
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
}
