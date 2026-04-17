export interface Customer {
  id: string;            // "KH001"
  name: string;          // tên khách hàng / công ty
  contact: string;       // người liên hệ
  phone: string;
  email: string;
  address: string;
  type: "retail" | "wholesale" | "enterprise";  // lẻ / sỉ / doanh nghiệp
  totalOrders: number;
  totalSpent: number;    // tổng đã chi tiêu (VND)
  debtAmount: number;    // công nợ chưa trả (VND)
  status: "active" | "inactive";
  joinDate: string;      // "DD/MM/YYYY"
  note?: string;
}
