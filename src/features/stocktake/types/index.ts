export type StocktakeStatus = "draft" | "counting" | "pending_approval" | "completed" | "cancelled";

export interface StocktakeItem {
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  systemQty: number;        // Tồn hệ thống
  actualQty: number | null; // Thực đếm (null = chưa nhập)
  note: string;
}

export interface Stocktake {
  id: string;
  code: string;            // VD: "KK-2024-001"
  warehouseId: string;
  warehouseName: string;
  status: StocktakeStatus;
  assignedTo: string;      // Người phụ trách
  createdBy: string;
  createdAt: string;
  scheduledDate: string;
  completedAt?: string;
  note?: string;
  items: StocktakeItem[];
}
