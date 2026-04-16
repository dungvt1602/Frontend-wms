export type OrderType     = "import" | "export";
export type OrderStatus   = "pending" | "processing" | "shipping" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "partial";

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  type: OrderType;
  /* xuất kho */
  customer?: string;
  phone?: string;
  address?: string;
  /* nhập kho */
  supplier?: string;
  supplierPhone?: string;
  items: OrderItem[];
  warehouse: string;      // kho nhận (nhập) hoặc kho xuất (xuất)
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  note?: string;
}

/* helpers */
export function orderTotal(order: Order): number {
  return order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
}

export const ORDER_TYPE_CFG: Record<OrderType, { label: string; cls: string }> = {
  import: { label: "Nhập kho", cls: "text-blue-700 bg-blue-50 border-blue-200"       },
  export: { label: "Xuất kho", cls: "text-violet-700 bg-violet-50 border-violet-200" },
};

export const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  pending:    { label: "Chờ xử lý",  cls: "text-amber-700   bg-amber-50   border-amber-200",   dot: "bg-amber-400"   },
  processing: { label: "Đang xử lý", cls: "text-blue-700    bg-blue-50    border-blue-200",    dot: "bg-blue-500"    },
  shipping:   { label: "Đang giao",  cls: "text-violet-700  bg-violet-50  border-violet-200",  dot: "bg-violet-500"  },
  completed:  { label: "Hoàn thành", cls: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  cancelled:  { label: "Đã huỷ",    cls: "text-red-600     bg-red-50     border-red-200",      dot: "bg-red-500"     },
};

export const PAYMENT_CFG: Record<PaymentStatus, { label: string; cls: string }> = {
  paid:    { label: "Đã thanh toán",     cls: "text-emerald-600" },
  unpaid:  { label: "Chưa thanh toán",   cls: "text-red-500"     },
  partial: { label: "Thanh toán 1 phần", cls: "text-amber-600"   },
};
