"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
import SupplierStats        from "@/features/suppliers/components/SupplierStats";
import SupplierFilters      from "@/features/suppliers/components/SupplierFilters";
import SupplierTable        from "@/features/suppliers/components/SupplierTable";
import AddSupplierModal     from "@/features/suppliers/components/AddSupplierModal";
import SupplierDetailModal  from "@/features/suppliers/components/SupplierDetailModal";
import EditSupplierModal    from "@/features/suppliers/components/EditSupplierModal";
import type { Supplier } from "@/features/suppliers/types";

/* ══════════════ Mock data ══════════════ */
const suppliers: Supplier[] = [
  {
    id: "NCC001", name: "Dell Vietnam",       contact: "Nguyễn Minh Tuấn",
    phone: "024 3941 0000", email: "sales@dell.com.vn",
    address: "Tòa nhà Keangnam, Phạm Hùng, Hà Nội",
    category: "Điện tử",   totalProducts: 8,  totalOrders: 42, debtAmount: 125_000_000, status: "active",   rating: 5,
  },
  {
    id: "NCC002", name: "LG Electronics VN",  contact: "Trần Thu Hà",
    phone: "028 3997 8888", email: "contact@lg.com.vn",
    address: "Tòa nhà Vietcombank, Đường 3/2, TP.HCM",
    category: "Điện tử",   totalProducts: 5,  totalOrders: 28, debtAmount: 0,           status: "active",   rating: 4,
  },
  {
    id: "NCC003", name: "Keychron",            contact: "David Chen",
    phone: "+852 9123 4567", email: "wholesale@keychron.com",
    address: "Wanchai, Hong Kong",
    category: "Phụ kiện",  totalProducts: 3,  totalOrders: 15, debtAmount: 38_500_000,  status: "active",   rating: 5,
  },
  {
    id: "NCC004", name: "Logitech Vietnam",   contact: "Lê Hoàng Nam",
    phone: "028 7300 6789", email: "b2b@logitech.vn",
    address: "Quận 1, TP.HCM",
    category: "Phụ kiện",  totalProducts: 12, totalOrders: 67, debtAmount: 0,           status: "active",   rating: 4,
  },
  {
    id: "NCC005", name: "Samsung Electronics", contact: "Phạm Thị Lan",
    phone: "1800 588 889",  email: "b2b@samsung.com.vn",
    address: "Samsung Village, Yên Phong, Bắc Ninh",
    category: "Linh kiện", totalProducts: 9,  totalOrders: 53, debtAmount: 210_000_000, status: "active",   rating: 5,
  },
  {
    id: "NCC006", name: "Kingston Technology", contact: "Michael Wong",
    phone: "+1 714 435 2600", email: "asia@kingston.com",
    address: "Fountain Valley, California, USA",
    category: "Linh kiện", totalProducts: 6,  totalOrders: 31, debtAmount: 0,           status: "active",   rating: 3,
  },
  {
    id: "NCC007", name: "Sony Vietnam",        contact: "Vũ Thanh Tùng",
    phone: "1800 599 902",  email: "corporate@sony.com.vn",
    address: "Tòa nhà Hà Nội Center, Hai Bà Trưng, Hà Nội",
    category: "Phụ kiện",  totalProducts: 4,  totalOrders: 19, debtAmount: 74_000_000,  status: "active",   rating: 4,
  },
  {
    id: "NCC008", name: "Anker Innovations",   contact: "Steven Li",
    phone: "+86 755 8698 8988", email: "partners@anker.com",
    address: "Changsha, Hunan, China",
    category: "Phụ kiện",  totalProducts: 7,  totalOrders: 44, debtAmount: 0,           status: "active",   rating: 4,
  },
  {
    id: "NCC009", name: "ASUS Vietnam",        contact: "Đỗ Quang Huy",
    phone: "1900 599 940",  email: "b2b@asus.com.vn",
    address: "Tòa nhà Diamond Plaza, Lê Duẩn, TP.HCM",
    category: "Linh kiện", totalProducts: 11, totalOrders: 36, debtAmount: 310_000_000, status: "active",   rating: 4,
  },
  {
    id: "NCC010", name: "Western Digital",     contact: "Anna Pham",
    phone: "+1 949 672 7000", email: "asia-sales@wdc.com",
    address: "San Jose, California, USA",
    category: "Linh kiện", totalProducts: 5,  totalOrders: 22, debtAmount: 0,           status: "inactive", rating: 3,
  },
];

/* ══════════════ Page ══════════════ */
export default function SuppliersPage() {
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("Tất cả");
  const [statusF,   setStatusF]   = useState("all");
  const [page,      setPage]      = useState(1);
  const [showAdd,   setShowAdd]   = useState(false);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>(suppliers);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleCreated = (s: Supplier) => setAllSuppliers((prev) => [s, ...prev]);

  const handleSaved = (updated: Supplier) =>
    setAllSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const resetPage = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };

  const filtered = allSuppliers.filter((s) =>
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     s.id.toLowerCase().includes(search.toLowerCase()) ||
     s.contact.toLowerCase().includes(search.toLowerCase())) &&
    (category === "Tất cả" || s.category === category) &&
    (statusF === "all" || s.status === statusF)
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Nhà cung cấp</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý đối tác và công nợ nhà cung cấp</p>
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
            <Plus size={15} /> Thêm nhà cung cấp
          </button>
        </div>
      </div>

      <SupplierStats suppliers={allSuppliers} />

      <SupplierFilters
        search={search}
        category={category}
        statusF={statusF}
        onSearch={resetPage(setSearch)}
        onCategory={resetPage(setCategory)}
        onStatus={resetPage(setStatusF)}
      />

      <SupplierTable
        items={filtered}
        total={filtered.length}
        page={page}
        onPage={setPage}
        onView={setViewingSupplier}
        onEdit={setEditingSupplier}
      />

      {showAdd && (
        <AddSupplierModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}

      {viewingSupplier && (
        <SupplierDetailModal
          supplier={viewingSupplier}
          onClose={() => setViewingSupplier(null)}
          onEdit={() => {
            setEditingSupplier(viewingSupplier);
            setViewingSupplier(null);
          }}
        />
      )}

      {editingSupplier && (
        <EditSupplierModal
          supplier={editingSupplier}
          onClose={() => setEditingSupplier(null)}
          onSaved={(updated) => {
            handleSaved(updated);
            setEditingSupplier(null);
          }}
        />
      )}

    </div>
  );
}
