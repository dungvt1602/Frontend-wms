export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  buyPrice: string;
  sellPrice: string;
  supplier: string;
  status: "active" | "inactive";
}

export interface StockByWarehouse {
  warehouse: string;
  current: number;
  min: number;
  capacity: number;
}

export interface ProductHistory {
  id: string;
  type: "import" | "export";
  qty: number;
  orderId: string;
  warehouse: string;
  date: string;
  partner: string;
}

export interface ProductDetail extends Product {
  description: string;
  stock: StockByWarehouse[];
  history: ProductHistory[];
}
