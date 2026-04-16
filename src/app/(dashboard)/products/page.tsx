"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import ProductFilters   from "@/features/products/components/ProductFilters";
import ProductTable     from "@/features/products/components/ProductTable";
import AddProductModal  from "@/features/products/components/AddProductModal";
import type { Product } from "@/features/products/types";

/* ══════════════ Mock data ══════════════ */
const products: Product[] = [
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

const activeCount   = products.filter((p) => p.status === "active").length;
const inactiveCount = products.filter((p) => p.status === "inactive").length;

/* ══════════════ Page ══════════════ */
export default function ProductsPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [statusF,  setStatusF]  = useState("all");
  const [sortDir,  setSortDir]  = useState<"asc" | "desc" | null>(null);
  const [page,     setPage]     = useState(1);
  const [showAdd,  setShowAdd]  = useState(false);

  const resetPage = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };

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

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh mục sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {products.length} sản phẩm · {activeCount} đang kinh doanh · {inactiveCount} ngừng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <Download size={15} /> Xuất Excel
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
          >
            <Plus size={15} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <ProductFilters
        search={search}
        category={category}
        statusF={statusF}
        onSearch={resetPage(setSearch)}
        onCategory={resetPage(setCategory)}
        onStatus={resetPage(setStatusF)}
      />

      <ProductTable
        items={filtered}
        total={filtered.length}
        page={page}
        sortDir={sortDir}
        onSort={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
        onPage={setPage}
      />

      {showAdd && (
        <AddProductModal onClose={() => setShowAdd(false)} />
      )}

    </div>
  );
}
