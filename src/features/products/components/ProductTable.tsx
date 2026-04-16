"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown, ShoppingBag, Tag,
  Pencil, Trash2, MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import type { Product } from "../types";

const PAGE_SIZE = 8;

const categoryColors: Record<string, string> = {
  "Điện tử":  "bg-blue-50 text-blue-700",
  "Phụ kiện": "bg-purple-50 text-purple-700",
  "Linh kiện":"bg-orange-50 text-orange-700",
};

interface Props {
  items: Product[];   // already filtered
  total: number;
  page: number;
  sortDir: "asc" | "desc" | null;
  onSort: () => void;
  onPage: (p: number) => void;
}

export default function ProductTable({ items, total, page, sortDir, onSort, onPage }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated  = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 w-[90px]">Mã SP</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Tên sản phẩm</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Danh mục</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Đơn vị</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Giá nhập</th>
              <th
                className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 cursor-pointer select-none"
                onClick={onSort}
              >
                <span className="flex items-center gap-1">
                  Giá bán
                  <ArrowUpDown size={13} className={cn(sortDir ? "text-indigo-500" : "text-slate-300")} />
                </span>
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Nhà cung cấp</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 w-[50px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-slate-400">
                  <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Không tìm thấy sản phẩm nào</p>
                </td>
              </tr>
            ) : paginated.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">{p.id}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Tag size={13} className="text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-800 whitespace-nowrap">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", categoryColors[p.category])}>
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{p.unit}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.buyPrice} ₫</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 whitespace-nowrap">{p.sellPrice} ₫</td>
                <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.supplier}</td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border",
                    p.status === "active"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-slate-500 bg-slate-100 border-slate-200"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5",
                      p.status === "active" ? "bg-emerald-500" : "bg-slate-400")} />
                    {p.status === "active" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                  </span>
                </td>
                <td className="px-5 py-3.5 relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {openMenu === p.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-8 top-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1 overflow-hidden">
                        <button
                          onClick={() => { setOpenMenu(null); router.push(`/products/${p.id}`); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Pencil size={13} /> Chỉnh sửa
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} /> Xoá sản phẩm
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
            / <span className="font-medium text-slate-700">{total}</span> sản phẩm
          </p>
          <Pagination page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
}
