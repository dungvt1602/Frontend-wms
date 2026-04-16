"use client";

import { useState, Fragment } from "react";
import {
  ChevronDown, ChevronUp,
  MoreHorizontal, Eye, Pencil, XCircle, Package,
  PackageCheck, PackageOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import { ORDER_STATUS_CFG, ORDER_TYPE_CFG, PAYMENT_CFG, orderTotal } from "../types";
import type { Order } from "../types";

const PAGE_SIZE = 8;

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  return n.toLocaleString("vi-VN");
}

interface Props {
  items: Order[];
  total: number;
  page: number;
  onPage: (p: number) => void;
}

export default function OrderTable({ items, total, page, onPage }: Props) {
  const [openMenu,   setOpenMenu]   = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated  = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-3 py-3.5" />
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Mã đơn</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Loại</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Đối tác</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Kho</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Mặt hàng</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Tổng tiền</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Ngày tạo</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Thanh toán</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Trạng thái</th>
              <th className="px-4 py-3.5 w-[50px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16 text-slate-400">
                  <Package size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Không tìm thấy đơn hàng nào</p>
                </td>
              </tr>
            ) : paginated.map((o) => {
              const st      = ORDER_STATUS_CFG[o.status];
              const pay     = PAYMENT_CFG[o.paymentStatus];
              const typeCfg = ORDER_TYPE_CFG[o.type];
              const total   = orderTotal(o);
              const isOpen  = expandedId === o.id;

              /* tên đối tác tuỳ loại đơn */
              const partnerName  = o.type === "import" ? o.supplier  : o.customer;
              const partnerPhone = o.type === "import" ? o.supplierPhone : o.phone;
              const TypeIcon     = o.type === "import" ? PackageCheck : PackageOpen;

              return (
                <Fragment key={o.id}>
                  <tr className={cn("hover:bg-slate-50/60 transition-colors group", isOpen && "bg-indigo-50/30")}>

                    {/* Expand */}
                    <td className="px-3 py-3.5">
                      <button
                        onClick={() => setExpandedId(isOpen ? null : o.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                      >
                        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </td>

                    {/* Mã đơn */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold text-indigo-600">{o.id}</span>
                      {o.note && <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[110px]">{o.note}</p>}
                    </td>

                    {/* Loại đơn */}
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", typeCfg.cls)}>
                        <TypeIcon size={11} />
                        {typeCfg.label}
                      </span>
                    </td>

                    {/* Đối tác */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 whitespace-nowrap">{partnerName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{partnerPhone}</p>
                    </td>

                    {/* Kho */}
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{o.warehouse}</td>

                    {/* Số mặt hàng */}
                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">
                      {o.items.length}
                      <span className="text-xs font-normal text-slate-400 ml-1">loại</span>
                    </td>

                    {/* Tổng tiền */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-slate-900">{fmt(total)}</span>
                      <span className="text-xs text-slate-400 ml-0.5">₫</span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{o.createdAt}</td>

                    {/* Thanh toán */}
                    <td className="px-4 py-3.5">
                      <span className={cn("text-xs font-medium", pay.cls)}>{pay.label}</span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", st.cls)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                        {st.label}
                      </span>
                    </td>

                    {/* Action menu */}
                    <td className="px-4 py-3.5 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === o.id ? null : o.id)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenu === o.id && (
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
                              <XCircle size={13} /> Huỷ đơn
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>

                  {/* Expanded detail */}
                  {isOpen && (
                    <tr className="bg-indigo-50/20">
                      <td colSpan={11} className="px-14 py-3">
                        <div className="rounded-xl border border-indigo-100 overflow-hidden">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-indigo-50/60">
                                <th className="text-left font-semibold text-indigo-400 px-4 py-2">Sản phẩm</th>
                                <th className="text-right font-semibold text-indigo-400 px-4 py-2 w-20">SL</th>
                                <th className="text-right font-semibold text-indigo-400 px-4 py-2 w-32">Đơn giá</th>
                                <th className="text-right font-semibold text-indigo-400 px-4 py-2 w-32">Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-50">
                              {o.items.map((item) => (
                                <tr key={item.productId} className="bg-white">
                                  <td className="px-4 py-2 font-medium text-slate-700">{item.productName}</td>
                                  <td className="px-4 py-2 text-right text-slate-600">{item.qty}</td>
                                  <td className="px-4 py-2 text-right text-slate-600">{fmt(item.unitPrice)} ₫</td>
                                  <td className="px-4 py-2 text-right font-semibold text-slate-800">{fmt(item.qty * item.unitPrice)} ₫</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-indigo-50/40">
                                <td colSpan={3} className="px-4 py-2 text-right font-semibold text-indigo-700">Tổng cộng</td>
                                <td className="px-4 py-2 text-right font-bold text-indigo-700">{fmt(orderTotal(o))} ₫</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 pb-1">
                          {o.type === "export"
                            ? `Địa chỉ giao: ${o.address}`
                            : `Nhà cung cấp: ${o.supplier} · Nhập về: ${o.warehouse}`}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
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
            / <span className="font-medium text-slate-700">{total}</span> đơn hàng
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
}
