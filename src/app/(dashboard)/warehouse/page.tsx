"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import WarehouseStats    from "@/features/warehouse/components/WarehouseStats";
import WarehouseCard     from "@/features/warehouse/components/WarehouseCard";
import AddWarehouseModal from "@/features/warehouse/components/AddWarehouseModal";
import { WAREHOUSES }    from "@/features/warehouse/data/mock";
import type { Warehouse } from "@/features/warehouse/types";

/* ══════════════ Page ══════════════ */
export default function WarehousePage() {
  const [warehouses,  setWarehouses]  = useState<Warehouse[]>(WAREHOUSES);
  const [showAdd,     setShowAdd]     = useState(false);

  const handleCreated = (w: Warehouse) => setWarehouses((prev) => [...prev, w]);

  const maintenanceWarehouses = warehouses.filter((w) => w.status === "maintenance");

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý kho bãi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {warehouses.length} kho · {warehouses.reduce((s, w) => s + w.zones.length, 0)} khu vực
            · {warehouses.reduce((s, w) => s + w.totalArea, 0).toLocaleString("vi-VN")} m² tổng diện tích
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
        >
          <Plus size={15} /> Thêm kho
        </button>
      </div>

      {/* KPI */}
      <WarehouseStats warehouses={warehouses} />

      {/* Warehouse cards */}
      <div className="space-y-3">
        {warehouses.map((w, i) => (
          <WarehouseCard key={w.id} warehouse={w} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Maintenance banner */}
      {maintenanceWarehouses.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <Wrench size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {maintenanceWarehouses.map((w) => w.name).join(", ")} đang trong giai đoạn bảo trì
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Các hoạt động nhập xuất kho tạm thời bị gián đoạn. Dự kiến hoàn thành: 20/04/2026.
            </p>
          </div>
        </div>
      )}

      {showAdd && (
        <AddWarehouseModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}

    </div>
  );
}
