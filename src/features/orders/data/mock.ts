import type { Order } from "../types";

export const ORDERS: Order[] = [
  /* ── Đơn NHẬP KHO ── */
  {
    id: "IMP-2026-021", type: "import",
    supplier: "Dell Vietnam", supplierPhone: "024 3941 0000",
    warehouse: "Kho A", createdAt: "15/04/2026", status: "completed", paymentStatus: "paid",
    items: [
      { productId: "SP001", productName: "Laptop Dell XPS 15", qty: 20, unitPrice: 28_000_000 },
    ],
  },
  {
    id: "IMP-2026-020", type: "import",
    supplier: "Samsung Electronics", supplierPhone: "1800 588 889",
    warehouse: "Kho C", createdAt: "14/04/2026", status: "processing", paymentStatus: "partial",
    note: "Nhập lô RAM + SSD",
    items: [
      { productId: "SP005", productName: "SSD Samsung 970 EVO 1TB",  qty: 50, unitPrice: 2_600_000 },
      { productId: "SP006", productName: "RAM Kingston 16GB DDR5",   qty: 80, unitPrice: 1_100_000 },
    ],
  },
  {
    id: "IMP-2026-019", type: "import",
    supplier: "Logitech Vietnam", supplierPhone: "028 7300 6789",
    warehouse: "Kho B", createdAt: "12/04/2026", status: "completed", paymentStatus: "paid",
    items: [
      { productId: "SP004", productName: "Chuột Logitech MX Master 3", qty: 30, unitPrice: 1_500_000 },
      { productId: "SP008", productName: "Webcam Logitech C920",       qty: 20, unitPrice: 1_900_000 },
    ],
  },
  {
    id: "IMP-2026-018", type: "import",
    supplier: "Anker Innovations", supplierPhone: "+86 755 8698 8988",
    warehouse: "Kho B", createdAt: "10/04/2026", status: "pending", paymentStatus: "unpaid",
    items: [
      { productId: "SP009", productName: "Hub USB-C Anker 7-in-1", qty: 100, unitPrice: 680_000 },
      { productId: "SP012", productName: "Bộ sạc Anker 65W GaN",   qty: 80,  unitPrice: 580_000 },
    ],
  },
  {
    id: "IMP-2026-017", type: "import",
    supplier: "ASUS Vietnam", supplierPhone: "1900 599 940",
    warehouse: "Kho A", createdAt: "08/04/2026", status: "cancelled", paymentStatus: "unpaid",
    note: "Huỷ do lô hàng không đạt chất lượng",
    items: [
      { productId: "SP010", productName: "Card đồ họa RTX 4070", qty: 10, unitPrice: 15_000_000 },
    ],
  },

  /* ── Đơn XUẤT KHO ── */
  {
    id: "ORD-2026-089", type: "export",
    customer: "Công ty TNHH Minh Phát", phone: "028 3812 5678",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    warehouse: "Kho A", createdAt: "15/04/2026", status: "completed", paymentStatus: "paid",
    items: [
      { productId: "SP001", productName: "Laptop Dell XPS 15",       qty: 5,  unitPrice: 32_500_000 },
      { productId: "SP003", productName: "Bàn phím cơ Keychron K8", qty: 10, unitPrice: 2_150_000  },
    ],
  },
  {
    id: "ORD-2026-088", type: "export",
    customer: "Nguyễn Thành Long", phone: "0901 234 567",
    address: "45 Trần Phú, Ba Đình, Hà Nội",
    warehouse: "Kho B", createdAt: "14/04/2026", status: "shipping", paymentStatus: "paid",
    items: [
      { productId: "SP004", productName: "Chuột Logitech MX Master 3", qty: 2, unitPrice: 1_890_000 },
      { productId: "SP009", productName: "Hub USB-C Anker 7-in-1",    qty: 3, unitPrice: 890_000   },
    ],
  },
  {
    id: "ORD-2026-087", type: "export",
    customer: "Trường ĐH Bách Khoa HN", phone: "024 3869 2007",
    address: "1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    warehouse: "Kho A", createdAt: "14/04/2026", status: "processing", paymentStatus: "partial",
    note: "Giao theo đợt, đợt 1 tuần 20/04",
    items: [
      { productId: "SP002", productName: "Màn hình LG 27\" 4K",     qty: 20, unitPrice: 12_800_000 },
      { productId: "SP006", productName: "RAM Kingston 16GB DDR5",  qty: 40, unitPrice: 1_450_000  },
      { productId: "SP005", productName: "SSD Samsung 970 EVO 1TB", qty: 20, unitPrice: 3_200_000  },
    ],
  },
  {
    id: "ORD-2026-086", type: "export",
    customer: "Lê Thị Hương", phone: "0912 345 678",
    address: "78 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
    warehouse: "Kho C", createdAt: "13/04/2026", status: "pending", paymentStatus: "unpaid",
    items: [
      { productId: "SP007", productName: "Tai nghe Sony WH-1000XM5", qty: 1, unitPrice: 8_990_000 },
    ],
  },
  {
    id: "ORD-2026-085", type: "export",
    customer: "FPT Software", phone: "1900 6600",
    address: "17 Duy Tân, Cầu Giấy, Hà Nội",
    warehouse: "Kho A", createdAt: "12/04/2026", status: "completed", paymentStatus: "paid",
    items: [
      { productId: "SP001", productName: "Laptop Dell XPS 15",          qty: 15, unitPrice: 32_500_000 },
      { productId: "SP004", productName: "Chuột Logitech MX Master 3",  qty: 15, unitPrice: 1_890_000  },
      { productId: "SP003", productName: "Bàn phím cơ Keychron K8",    qty: 15, unitPrice: 2_150_000  },
    ],
  },
  {
    id: "ORD-2026-084", type: "export",
    customer: "Phạm Văn Đức", phone: "0933 456 789",
    address: "22 Nguyễn Huệ, Quận 1, TP.HCM",
    warehouse: "Kho B", createdAt: "11/04/2026", status: "cancelled", paymentStatus: "unpaid",
    note: "Khách huỷ do thay đổi nhu cầu",
    items: [
      { productId: "SP010", productName: "Card đồ họa RTX 4070", qty: 2, unitPrice: 18_500_000 },
    ],
  },
];
