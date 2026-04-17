"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, PackageOpen, Pencil, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_CFG,
  ORDER_TYPE_CFG,
  PAYMENT_CFG,
  orderTotal,
} from "@/features/orders/types";
import type { Order } from "@/features/orders/types";
import { ORDERS } from "@/features/orders/data/mock";
import EditOrderModal from "@/features/orders/components/EditOrderModal";

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ₫`;
  return `${n.toLocaleString("vi-VN")} ₫`;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const initial = ORDERS.find((o) => o.id === id);
  if (!initial) notFound();

  const [order,      setOrder]      = useState<Order>(initial);
  const [showEdit,   setShowEdit]   = useState(false);

  const typeCfg   = ORDER_TYPE_CFG[order.type];
  const statusCfg = ORDER_STATUS_CFG[order.status];
  const paymentCfg = PAYMENT_CFG[order.paymentStatus];
  const TypeIcon  = order.type === "import" ? PackageCheck : PackageOpen;
  const total     = orderTotal(order);
  const canCancel = order.status !== "completed" && order.status !== "cancelled";

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <button
              onClick={() => router.push("/orders")}
              className="hover:text-indigo-600 transition-colors"
            >
              Đơn hàng
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-mono font-semibold text-slate-800">{order.id}</span>
          </nav>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
              typeCfg.cls
            )}
          >
            <TypeIcon size={11} />
            {typeCfg.label}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
              statusCfg.cls
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* ── Body grid ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* ── Col trái (2/3) ── */}
        <div className="col-span-2 space-y-4">

          {/* Card: Thông tin đơn hàng */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Thông tin đơn hàng</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400 mb-0.5">Mã đơn</dt>
                <dd className="font-mono font-bold text-indigo-600">{order.id}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 mb-0.5">Ngày tạo</dt>
                <dd className="font-medium text-slate-800">{order.createdAt}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 mb-0.5">Kho</dt>
                <dd className="font-medium text-slate-800">{order.warehouse}</dd>
              </div>
              {order.note && (
                <div className="col-span-2">
                  <dt className="text-xs text-slate-400 mb-0.5">Ghi chú</dt>
                  <dd className="text-slate-700 leading-relaxed">{order.note}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Card: Đối tác */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Đối tác</h2>
            {order.type === "import" ? (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-400 mb-0.5">Nhà cung cấp</dt>
                  <dd className="font-medium text-slate-800">{order.supplier}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400 mb-0.5">SĐT</dt>
                  <dd className="font-medium text-slate-800">{order.supplierPhone}</dd>
                </div>
              </dl>
            ) : (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-400 mb-0.5">Khách hàng</dt>
                  <dd className="font-medium text-slate-800">{order.customer}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400 mb-0.5">SĐT</dt>
                  <dd className="font-medium text-slate-800">{order.phone}</dd>
                </div>
                {order.address && (
                  <div className="col-span-2">
                    <dt className="text-xs text-slate-400 mb-0.5">Địa chỉ giao</dt>
                    <dd className="text-slate-700 leading-relaxed">{order.address}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>

        {/* ── Col phải (1/3) ── */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5">
            <h2 className="text-sm font-semibold text-slate-700">Thanh toán &amp; Trạng thái</h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Thanh toán</p>
                <span className={cn("text-sm font-semibold", paymentCfg.cls)}>
                  {paymentCfg.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Trạng thái</p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                    statusCfg.cls
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                  {statusCfg.label}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <button
                onClick={() => setShowEdit(true)}
                className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-sm font-medium text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <Pencil size={14} /> Chỉnh sửa
              </button>
              <button
                disabled={!canCancel}
                className={cn(
                  "w-full flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-sm font-medium transition-colors",
                  canCancel
                    ? "text-red-600 border border-red-200 bg-red-50 hover:bg-red-100"
                    : "text-slate-300 border border-slate-100 bg-slate-50 cursor-not-allowed"
                )}
              >
                <XCircle size={14} /> Huỷ đơn
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditOrderModal
          order={order}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => setOrder(updated)}
        />
      )}

      {/* ── Danh sách mặt hàng (full width) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Danh sách mặt hàng</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Sản phẩm</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 w-32">Mã SP</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 w-20">SL</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 w-36">Đơn giá</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3.5 w-36">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.items.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{item.productName}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{item.productId}</td>
                  <td className="px-4 py-3.5 text-right text-slate-700">{item.qty}</td>
                  <td className="px-4 py-3.5 text-right text-slate-700">{fmt(item.unitPrice)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                    {fmt(item.qty * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50/40 border-t border-indigo-100">
                <td colSpan={4} className="px-5 py-3.5 text-right text-sm font-semibold text-indigo-700">
                  Tổng cộng
                </td>
                <td className="px-5 py-3.5 text-right text-sm font-bold text-indigo-700">
                  {fmt(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}
