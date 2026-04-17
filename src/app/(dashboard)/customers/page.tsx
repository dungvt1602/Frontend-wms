"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
import CustomerStats       from "@/features/customers/components/CustomerStats";
import CustomerFilters     from "@/features/customers/components/CustomerFilters";
import CustomerTable       from "@/features/customers/components/CustomerTable";
import AddCustomerModal    from "@/features/customers/components/AddCustomerModal";
import CustomerDetailModal from "@/features/customers/components/CustomerDetailModal";
import EditCustomerModal   from "@/features/customers/components/EditCustomerModal";
import { mockCustomers }   from "@/features/customers/data/mock";
import type { Customer }   from "@/features/customers/types";

export default function CustomersPage() {
  const [search,    setSearch]    = useState("");
  const [typeF,     setTypeF]     = useState("all");
  const [statusF,   setStatusF]   = useState("all");
  const [page,      setPage]      = useState(1);
  const [showAdd,   setShowAdd]   = useState(false);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(mockCustomers);
  const [viewing,   setViewing]   = useState<Customer | null>(null);
  const [editing,   setEditing]   = useState<Customer | null>(null);

  const handleCreated = (c: Customer) => setAllCustomers((prev) => [c, ...prev]);
  const handleSaved   = (updated: Customer) =>
    setAllCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

  const resetPage = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };

  const filtered = allCustomers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) ||
       c.id.toLowerCase().includes(q) ||
       c.contact.toLowerCase().includes(q) ||
       c.phone.includes(q)) &&
      (typeF   === "all" || c.type   === typeF)   &&
      (statusF === "all" || c.status === statusF)
    );
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Khách hàng</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý khách hàng và công nợ phải thu</p>
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
            <Plus size={15} /> Thêm khách hàng
          </button>
        </div>
      </div>

      <CustomerStats customers={allCustomers} />

      <CustomerFilters
        search={search}
        typeF={typeF}
        statusF={statusF}
        onSearch={resetPage(setSearch)}
        onType={resetPage(setTypeF)}
        onStatus={resetPage(setStatusF)}
      />

      <CustomerTable
        items={filtered}
        total={filtered.length}
        page={page}
        onPage={setPage}
        onView={setViewing}
        onEdit={setEditing}
      />

      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}

      {viewing && (
        <CustomerDetailModal
          customer={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
        />
      )}

      {editing && (
        <EditCustomerModal
          customer={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => { handleSaved(updated); setEditing(null); }}
        />
      )}

    </div>
  );
}
