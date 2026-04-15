"use client";

import { useState } from "react";
import {
  Search, Plus, Filter, Download, MoreHorizontal,
  ShoppingBag, ArrowUpDown, ChevronLeft, ChevronRight,
  Tag, Pencil, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ══════════════ Mock data ══════════════ */
const products = [
  { id: "SP001", name: "Laptop Dell XPS 15",         category: "Điện tử",   unit: "Cái",   buyPrice: "28,000,000", sellPrice: "32,500,000", supplier: "Dell Vietnam",    status: "active"   },
  { id: "SP002", name: "Màn hình LG 27\" 4K",        category: "Điện tử",   unit: "Cái",   buyPrice: "10,500,000", sellPrice: "12,800,000", supplier: "LG Electronics",  status: "active"   },
  { id: "SP003", name: "Bàn phím cơ Keychron K8",    category: "Phụ kiện",  unit: "Cái",   buyPrice: "1,700,000",  sellPrice: "2,150,000",  supplier: "Keychron",        status: "active"   },
  { id: "SP004", name: "Chuột Logitech MX Master 3", category: "Phụ kiện",  unit: "Cái",   buyPrice: "1,500,000",  sellPrice: "1,890,000",  supplier: "Logitech",        status: "active"   },
  { id: "SP005", name: "SSD Samsung 970 EVO 1TB",    category: "Linh kiện", unit: "Cái",   buyPrice: "2,600,000",  sellPrice: "3,200,000",  supplier: "Samsung",         status: "active"   },
  { id: "SP006", name: "RAM Kingston 16GB DDR5",     category: "Linh kiện", unit: "Thanh", buyPrice: "1,100,000",  sellPrice: "1,450,000",  supplier: "Kingston",        status: "active"   },
  { id: "SP007", name: "Tai nghe Sony WH-1000XM5",  category: "Phụ kiện",  unit: "Cái",   buyPrice: "7,200,000",  sellPrice: "8,990,000",  supplier: "Sony Vietnam",    status: "active"   },
  { id: "SP008", name: "Webcam Logitech C920",       category: "Phụ kiện",  unit: "Cái",   buyPrice: "1,900,000",  sellPrice: "2,350,000",  supplier: "Logitech",        status: "inactive" },
  { id: "SP009", name: "Hub USB-C Anker 7-in-1",    category: "Phụ kiện",  unit: "Cái",   buyPrice: "680,000",    sellPrice: "890,000",    supplier: "Anker",           status: "active"   },
  { id: "SP010", name: "Card đồ họa RTX 4070",      category: "Linh kiện", unit: "Cái",   buyPrice: "15,000,000", sellPrice: "18,500,000", supplier: "ASUS Vietnam",    status: "active"   },
  { id: "SP011", name: "Ổ cứng WD Blue 2TB",        category: "Linh kiện", unit: "Cái",   buyPrice: "1,300,000",  sellPrice: "1,650,000",  supplier: "Western Digital", status: "active"   },
  { id: "SP012", name: "Bộ sạc Anker 65W GaN",      category: "Phụ kiện",  unit: "Cái",   buyPrice: "580,000",    sellPrice: "750,000",    supplier: "Anker",           status: "inactive" },
];

const categories = ["Tất cả", "Điện tử", "Phụ kiện", "Linh kiện"];
const PAGE_SIZE  = 8;

export default function ProductsPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [statusF,  setStatusF]  = useState("all");
  const [sortDir,  setSortDir]  = useState<"asc" | "desc" | null>(null);
  const [page,     setPage]     = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = products
    .filter((p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())) &&
      (category === "Tất cả" || p.category === category) &&
      (statusF === "all" || p.status === statusF)
    )
    .sort((a, b) => {
      if (!sortDir) return 0;
      const av = parseInt(a.sellPrice.replace(/,/g, ""));
      const bv = parseInt(b.sellPrice.replace(/,/g, ""));
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCount   = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;

  const categoryColors: Record<string, string> = {
    "Điện tử":  "bg-blue-50 text-blue-700",
    "Phụ kiện": "bg-purple-50 text-purple-700",
    "Linh kiện":"bg-orange-50 text-orange-700",
  };

  return (
    <div className="space-y-5 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh mục sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} sản phẩm · {activeCount} đang kinh doanh · {inactiveCount} ngừng</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <Download size={15} /> Xuất Excel
          </button>
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}>
            <Plus size={15} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Tìm mã SP, tên sản phẩm..."
                   value={search}
                   onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                   className="w-full h-9 pl-9 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {categories.map((c) => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        category === c ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select value={statusF} onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                    className="h-9 pl-8 pr-6 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-600 outline-none focus:border-indigo-400 appearance-none cursor-pointer">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang kinh doanh</option>
              <option value="inactive">Ngừng kinh doanh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
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
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 cursor-pointer select-none"
                    onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}>
                  <span className="flex items-center gap-1">
                    Giá bán
                    <ArrowUpDown size={13} className={cn(sortDir ? "text-indigo-500" : "text-slate-300")} />
                  </span>
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Nhà cung cấp</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 w-[50px]"></th>
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
                      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", p.status === "active" ? "bg-emerald-500" : "bg-slate-400")} />
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
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
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
              Hiển thị <span className="font-medium text-slate-700">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> / <span className="font-medium text-slate-700">{filtered.length}</span> sản phẩm
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                        className={cn("w-8 h-8 rounded-lg text-xs font-medium transition-all",
                          n === page ? "text-white" : "text-slate-600 hover:bg-slate-100")}
                        style={n === page ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
