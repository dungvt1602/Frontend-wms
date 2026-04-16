"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import ProductDetailHeader  from "@/features/products/components/ProductDetailHeader";
import ProductInfoForm      from "@/features/products/components/ProductInfoForm";
import ProductStockInfo     from "@/features/products/components/ProductStockInfo";
import ProductHistoryTable  from "@/features/products/components/ProductHistoryTable";
import type { ProductDetail } from "@/features/products/types";

/* ══════════════ Mock data ══════════════ */
const PRODUCTS: ProductDetail[] = [
  {
    id: "SP001", name: "Laptop Dell XPS 15", category: "Điện tử", unit: "Cái",
    buyPrice: "28,000,000", sellPrice: "32,500,000",
    supplier: "Dell Vietnam", status: "active",
    description: "Laptop cao cấp Dell XPS 15, chip Intel Core i7 thế hệ 13, RAM 16GB DDR5, SSD 512GB, màn hình OLED 3.5K.",
    stock: [
      { warehouse: "Kho A", current: 18, min: 5,  capacity: 50 },
      { warehouse: "Kho B", current: 4,  min: 5,  capacity: 30 },
      { warehouse: "Kho C", current: 0,  min: 3,  capacity: 20 },
    ],
    history: [
      { id: "h1",  type: "export", qty: 5,  orderId: "ORD-2026-089", warehouse: "Kho A", date: "15/04/2026", partner: "Công ty TNHH Minh Phát" },
      { id: "h2",  type: "export", qty: 15, orderId: "ORD-2026-085", warehouse: "Kho A", date: "12/04/2026", partner: "FPT Software" },
      { id: "h3",  type: "import", qty: 20, orderId: "IMP-2026-021", warehouse: "Kho A", date: "15/04/2026", partner: "Dell Vietnam" },
      { id: "h4",  type: "export", qty: 3,  orderId: "ORD-2026-080", warehouse: "Kho B", date: "10/04/2026", partner: "Nguyễn Văn An" },
      { id: "h5",  type: "import", qty: 10, orderId: "IMP-2026-015", warehouse: "Kho B", date: "05/04/2026", partner: "Dell Vietnam" },
      { id: "h6",  type: "export", qty: 7,  orderId: "ORD-2026-072", warehouse: "Kho A", date: "01/04/2026", partner: "Trường ĐH Bách Khoa" },
    ],
  },
  {
    id: "SP002", name: "Màn hình LG 27\" 4K", category: "Điện tử", unit: "Cái",
    buyPrice: "10,500,000", sellPrice: "12,800,000",
    supplier: "LG Electronics", status: "active",
    description: "Màn hình LG 27 inch độ phân giải 4K UHD, tấm nền IPS, 60Hz, cổng USB-C, HDMI, DisplayPort.",
    stock: [
      { warehouse: "Kho A", current: 12, min: 3, capacity: 30 },
      { warehouse: "Kho B", current: 8,  min: 3, capacity: 20 },
      { warehouse: "Kho C", current: 5,  min: 2, capacity: 15 },
    ],
    history: [
      { id: "h1", type: "export", qty: 20, orderId: "ORD-2026-087", warehouse: "Kho A", date: "14/04/2026", partner: "Trường ĐH Bách Khoa HN" },
      { id: "h2", type: "import", qty: 30, orderId: "IMP-2026-018", warehouse: "Kho A", date: "08/04/2026", partner: "LG Electronics" },
      { id: "h3", type: "export", qty: 5,  orderId: "ORD-2026-075", warehouse: "Kho B", date: "02/04/2026", partner: "Công ty ABC" },
    ],
  },
  {
    id: "SP003", name: "Bàn phím cơ Keychron K8", category: "Phụ kiện", unit: "Cái",
    buyPrice: "1,700,000", sellPrice: "2,150,000",
    supplier: "Keychron", status: "active",
    description: "Bàn phím cơ Keychron K8 TKL, switch Gateron G Pro Red, kết nối Bluetooth 5.1 + USB-C, đèn RGB.",
    stock: [
      { warehouse: "Kho A", current: 25, min: 10, capacity: 80 },
      { warehouse: "Kho B", current: 9,  min: 10, capacity: 50 },
      { warehouse: "Kho C", current: 15, min: 5,  capacity: 40 },
    ],
    history: [
      { id: "h1", type: "export", qty: 10, orderId: "ORD-2026-089", warehouse: "Kho A", date: "15/04/2026", partner: "Công ty TNHH Minh Phát" },
      { id: "h2", type: "export", qty: 15, orderId: "ORD-2026-085", warehouse: "Kho A", date: "12/04/2026", partner: "FPT Software" },
      { id: "h3", type: "import", qty: 50, orderId: "IMP-2026-019", warehouse: "Kho A", date: "12/04/2026", partner: "Keychron" },
    ],
  },
  {
    id: "SP004", name: "Chuột Logitech MX Master 3", category: "Phụ kiện", unit: "Cái",
    buyPrice: "1,500,000", sellPrice: "1,890,000",
    supplier: "Logitech", status: "active",
    description: "Chuột không dây cao cấp Logitech MX Master 3, Bluetooth + USB receiver, pin 70 ngày, cuộn từ tính.",
    stock: [
      { warehouse: "Kho A", current: 30, min: 10, capacity: 100 },
      { warehouse: "Kho B", current: 12, min: 8,  capacity: 60  },
      { warehouse: "Kho C", current: 6,  min: 5,  capacity: 40  },
    ],
    history: [
      { id: "h1", type: "export", qty: 2,  orderId: "ORD-2026-088", warehouse: "Kho B", date: "14/04/2026", partner: "Nguyễn Thành Long" },
      { id: "h2", type: "export", qty: 15, orderId: "ORD-2026-085", warehouse: "Kho A", date: "12/04/2026", partner: "FPT Software" },
      { id: "h3", type: "import", qty: 30, orderId: "IMP-2026-019", warehouse: "Kho B", date: "12/04/2026", partner: "Logitech Vietnam" },
    ],
  },
  {
    id: "SP005", name: "SSD Samsung 970 EVO 1TB", category: "Linh kiện", unit: "Cái",
    buyPrice: "2,600,000", sellPrice: "3,200,000",
    supplier: "Samsung", status: "active",
    description: "Ổ cứng SSD Samsung 970 EVO Plus 1TB NVMe M.2, tốc độ đọc 3500 MB/s, ghi 3300 MB/s.",
    stock: [
      { warehouse: "Kho A", current: 20, min: 10, capacity: 100 },
      { warehouse: "Kho B", current: 3,  min: 10, capacity: 60  },
      { warehouse: "Kho C", current: 15, min: 5,  capacity: 50  },
    ],
    history: [
      { id: "h1", type: "export", qty: 20, orderId: "ORD-2026-087", warehouse: "Kho A", date: "14/04/2026", partner: "Trường ĐH Bách Khoa HN" },
      { id: "h2", type: "import", qty: 50, orderId: "IMP-2026-020", warehouse: "Kho C", date: "14/04/2026", partner: "Samsung Electronics" },
    ],
  },
  {
    id: "SP006", name: "RAM Kingston 16GB DDR5", category: "Linh kiện", unit: "Thanh",
    buyPrice: "1,100,000", sellPrice: "1,450,000",
    supplier: "Kingston", status: "active",
    description: "RAM Kingston Fury Beast 16GB DDR5 5200MHz, tản nhiệt nhôm, tương thích Intel & AMD.",
    stock: [
      { warehouse: "Kho A", current: 50, min: 20, capacity: 150 },
      { warehouse: "Kho B", current: 30, min: 15, capacity: 100 },
      { warehouse: "Kho C", current: 20, min: 10, capacity: 80  },
    ],
    history: [
      { id: "h1", type: "export", qty: 40, orderId: "ORD-2026-087", warehouse: "Kho A", date: "14/04/2026", partner: "Trường ĐH Bách Khoa HN" },
      { id: "h2", type: "import", qty: 80, orderId: "IMP-2026-020", warehouse: "Kho C", date: "14/04/2026", partner: "Samsung Electronics" },
    ],
  },
  {
    id: "SP007", name: "Tai nghe Sony WH-1000XM5", category: "Phụ kiện", unit: "Cái",
    buyPrice: "7,200,000", sellPrice: "8,990,000",
    supplier: "Sony Vietnam", status: "active",
    description: "Tai nghe chống ồn Sony WH-1000XM5, Bluetooth 5.2, pin 30 giờ, giảm ồn chủ động hàng đầu.",
    stock: [
      { warehouse: "Kho A", current: 8, min: 3, capacity: 30 },
      { warehouse: "Kho B", current: 5, min: 3, capacity: 20 },
      { warehouse: "Kho C", current: 2, min: 2, capacity: 15 },
    ],
    history: [
      { id: "h1", type: "export", qty: 1, orderId: "ORD-2026-086", warehouse: "Kho C", date: "13/04/2026", partner: "Lê Thị Hương" },
      { id: "h2", type: "import", qty: 15, orderId: "IMP-2026-014", warehouse: "Kho A", date: "01/04/2026", partner: "Sony Vietnam" },
    ],
  },
  {
    id: "SP008", name: "Webcam Logitech C920", category: "Phụ kiện", unit: "Cái",
    buyPrice: "1,900,000", sellPrice: "2,350,000",
    supplier: "Logitech", status: "inactive",
    description: "Webcam Full HD 1080p Logitech C920, kết nối USB, có mic tích hợp, tương thích mọi nền tảng họp trực tuyến.",
    stock: [
      { warehouse: "Kho A", current: 0, min: 5, capacity: 40 },
      { warehouse: "Kho B", current: 2, min: 5, capacity: 30 },
      { warehouse: "Kho C", current: 0, min: 3, capacity: 20 },
    ],
    history: [
      { id: "h1", type: "import", qty: 20, orderId: "IMP-2026-019", warehouse: "Kho B", date: "12/04/2026", partner: "Logitech Vietnam" },
      { id: "h2", type: "export", qty: 8,  orderId: "ORD-2026-070", warehouse: "Kho A", date: "28/03/2026", partner: "Công ty XYZ" },
    ],
  },
  {
    id: "SP009", name: "Hub USB-C Anker 7-in-1", category: "Phụ kiện", unit: "Cái",
    buyPrice: "680,000", sellPrice: "890,000",
    supplier: "Anker", status: "active",
    description: "Hub USB-C Anker 7 cổng: USB-A 3.0 x3, HDMI 4K, SD/TF card, USB-C sạc 100W PD.",
    stock: [
      { warehouse: "Kho A", current: 45, min: 15, capacity: 150 },
      { warehouse: "Kho B", current: 20, min: 10, capacity: 100 },
      { warehouse: "Kho C", current: 18, min: 8,  capacity: 80  },
    ],
    history: [
      { id: "h1", type: "export", qty: 3,   orderId: "ORD-2026-088", warehouse: "Kho B", date: "14/04/2026", partner: "Nguyễn Thành Long" },
      { id: "h2", type: "import", qty: 100, orderId: "IMP-2026-018", warehouse: "Kho A", date: "10/04/2026", partner: "Anker Innovations" },
    ],
  },
  {
    id: "SP010", name: "Card đồ họa RTX 4070", category: "Linh kiện", unit: "Cái",
    buyPrice: "15,000,000", sellPrice: "18,500,000",
    supplier: "ASUS Vietnam", status: "active",
    description: "Card đồ họa ASUS TUF RTX 4070 12GB GDDR6X, 3 quạt, OC mode, hỗ trợ DLSS 3.0.",
    stock: [
      { warehouse: "Kho A", current: 5, min: 3, capacity: 20 },
      { warehouse: "Kho B", current: 2, min: 2, capacity: 15 },
      { warehouse: "Kho C", current: 3, min: 2, capacity: 10 },
    ],
    history: [
      { id: "h1", type: "import", qty: 10, orderId: "IMP-2026-017", warehouse: "Kho A", date: "08/04/2026", partner: "ASUS Vietnam" },
      { id: "h2", type: "export", qty: 2,  orderId: "ORD-2026-084", warehouse: "Kho B", date: "11/04/2026", partner: "Phạm Văn Đức" },
    ],
  },
  {
    id: "SP011", name: "Ổ cứng WD Blue 2TB", category: "Linh kiện", unit: "Cái",
    buyPrice: "1,300,000", sellPrice: "1,650,000",
    supplier: "Western Digital", status: "active",
    description: "Ổ cứng HDD Western Digital Blue 2TB, 7200 RPM, SATA III, cache 256MB, bảo hành 2 năm.",
    stock: [
      { warehouse: "Kho A", current: 30, min: 10, capacity: 100 },
      { warehouse: "Kho B", current: 20, min: 8,  capacity: 60  },
      { warehouse: "Kho C", current: 12, min: 5,  capacity: 40  },
    ],
    history: [
      { id: "h1", type: "import", qty: 40, orderId: "IMP-2026-016", warehouse: "Kho A", date: "06/04/2026", partner: "Western Digital" },
      { id: "h2", type: "export", qty: 10, orderId: "ORD-2026-078", warehouse: "Kho A", date: "05/04/2026", partner: "Công ty Tech Plus" },
    ],
  },
  {
    id: "SP012", name: "Bộ sạc Anker 65W GaN", category: "Phụ kiện", unit: "Cái",
    buyPrice: "580,000", sellPrice: "750,000",
    supplier: "Anker", status: "inactive",
    description: "Bộ sạc GaN Anker 65W, 3 cổng (2x USB-C + 1x USB-A), hỗ trợ PD 3.0, nhỏ gọn cho laptop.",
    stock: [
      { warehouse: "Kho A", current: 4,  min: 10, capacity: 100 },
      { warehouse: "Kho B", current: 2,  min: 10, capacity: 80  },
      { warehouse: "Kho C", current: 0,  min: 5,  capacity: 50  },
    ],
    history: [
      { id: "h1", type: "import", qty: 80, orderId: "IMP-2026-018", warehouse: "Kho A", date: "10/04/2026", partner: "Anker Innovations" },
      { id: "h2", type: "export", qty: 50, orderId: "ORD-2026-076", warehouse: "Kho A", date: "08/04/2026", partner: "Hoa Phát Retail" },
    ],
  },
];

/* ══════════════ Page ══════════════ */
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const initial = PRODUCTS.find((p) => p.id === id);
  if (!initial) notFound();

  const [form,   setForm]   = useState<ProductDetail>(initial);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleChange = (field: keyof ProductDetail, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">

      <ProductDetailHeader
        id={form.id}
        name={form.name}
        status={form.status}
        saving={saving}
        saved={saved}
        onSave={handleSave}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <ProductInfoForm form={form} onChange={handleChange} />
        <ProductStockInfo stock={form.stock} />
      </div>

      <ProductHistoryTable history={form.history} />

    </div>
  );
}
