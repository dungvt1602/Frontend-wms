export interface StockItem {
  id: string;
  name: string;
  warehouse: string;
  current: number;
  min: number;
  unit: string;
  lastIn: string;
  lastOut: string;
}

export type StockStatus = "ok" | "low" | "out";

export type LogType = "adjust_increase" | "adjust_decrease" | "transfer";

export interface InventoryLog {
  id: string;
  type: LogType;
  productId: string;
  productName: string;
  qty: number;
  fromWarehouse?: string;   // chuyển kho
  toWarehouse?: string;     // chuyển kho
  warehouse?: string;       // điều chỉnh
  reason: string;
  note: string;
  createdAt: string;        // "HH:mm DD/MM/YYYY"
  createdBy: string;
}

export function getStatus(current: number, min: number): StockStatus {
  if (current === 0) return "out";
  if (current < min) return "low";
  return "ok";
}
