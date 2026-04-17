"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
import OrderStats        from "@/features/orders/components/OrderStats";
import OrderFilters      from "@/features/orders/components/OrderFilters";
import OrderTable        from "@/features/orders/components/OrderTable";
import CreateOrderModal  from "@/features/orders/components/CreateOrderModal";
import EditOrderModal    from "@/features/orders/components/EditOrderModal";
import type { Order } from "@/features/orders/types";
import { ORDERS } from "@/features/orders/data/mock";

/* ══════════════ Page ══════════════ */
export default function OrdersPage() {
  const [search,      setSearch]      = useState("");
  const [typeF,       setTypeF]       = useState("all");
  const [statusF,     setStatusF]     = useState("all");
  const [paymentF,    setPaymentF]    = useState("all");
  const [page,        setPage]        = useState(1);
  const [showCreate,  setShowCreate]  = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [allOrders,   setAllOrders]   = useState<Order[]>(ORDERS);

  const handleCreated = (order: Order) => setAllOrders((prev) => [order, ...prev]);
  const handleSaved   = (updated: Order) =>
    setAllOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

  const resetPage = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };

  const filtered = allOrders.filter((o) => {
    const q = search.toLowerCase();
    const partnerName = (o.type === "import" ? o.supplier : o.customer) ?? "";
    const partnerPhone = (o.type === "import" ? o.supplierPhone : o.phone) ?? "";
    return (
      (o.id.toLowerCase().includes(q) ||
       partnerName.toLowerCase().includes(q) ||
       partnerPhone.includes(q)) &&
      (typeF    === "all" || o.type          === typeF)    &&
      (statusF  === "all" || o.status        === statusF)  &&
      (paymentF === "all" || o.paymentStatus === paymentF)
    );
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Đơn hàng</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý đơn nhập kho và xuất kho</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <Download size={15} /> Xuất Excel
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
          >
            <Plus size={15} /> Tạo đơn hàng
          </button>
        </div>
      </div>

      <OrderStats orders={allOrders} />

      <OrderFilters
        search={search}
        typeF={typeF}
        statusF={statusF}
        paymentF={paymentF}
        onSearch={resetPage(setSearch)}
        onType={resetPage(setTypeF)}
        onStatus={resetPage(setStatusF)}
        onPayment={resetPage(setPaymentF)}
      />

      <OrderTable
        items={filtered}
        total={filtered.length}
        page={page}
        onPage={setPage}
        onEdit={(o) => setEditingOrder(o)}
      />

      {showCreate && (
        <CreateOrderModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSaved={(updated) => { handleSaved(updated); setEditingOrder(null); }}
        />
      )}

    </div>
  );
}
