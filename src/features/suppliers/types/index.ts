export interface Supplier {
  id: string;
  name: string;
  contact: string;       // người liên hệ
  phone: string;
  email: string;
  address: string;
  category: string;      // nhóm hàng cung cấp
  totalProducts: number; // số mặt hàng
  totalOrders: number;   // tổng đơn đã đặt
  debtAmount: number;    // công nợ (VND)
  status: "active" | "inactive";
  rating: 1 | 2 | 3 | 4 | 5;
}
