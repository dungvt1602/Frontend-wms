"use client";

import { useState } from "react";
import RecentOrdersModal from "./RecentOrdersModal";
import type { DashboardOrder } from "./RecentOrdersModal";

interface Props {
  orders: DashboardOrder[];
}

export default function AllOrdersButton({ orders }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
      >
        Xem tất cả →
      </button>

      {open && (
        <RecentOrdersModal orders={orders} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
