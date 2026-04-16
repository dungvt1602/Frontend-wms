export interface RevenuePoint {
  label: string;   // "10/04", "Th1"...
  revenue: number; // VND
  orders: number;
}

export interface TopProduct {
  rank: number;
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  trend: "up" | "down" | "stable";
}

export interface CategoryStat {
  name: string;
  revenue: number;
  percent: number;
  color: string;
}

export type Period = "7d" | "30d" | "90d";
