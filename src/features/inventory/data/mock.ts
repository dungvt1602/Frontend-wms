import type { StockItem, InventoryLog } from "../types";

export const STOCK_ITEMS: StockItem[] = [
  { id: "SP001", name: "Laptop Dell XPS 15",         warehouse: "Kho A - Kệ 3", current: 48,  min: 10, unit: "Cái",   lastIn: "12/04/2026", lastOut: "14/04/2026" },
  { id: "SP002", name: 'Màn hình LG 27" 4K',         warehouse: "Kho A - Kệ 1", current: 7,   min: 10, unit: "Cái",   lastIn: "10/04/2026", lastOut: "13/04/2026" },
  { id: "SP003", name: "Bàn phím cơ Keychron K8",    warehouse: "Kho B - Kệ 5", current: 124, min: 20, unit: "Cái",   lastIn: "08/04/2026", lastOut: "14/04/2026" },
  { id: "SP004", name: "Chuột Logitech MX Master 3", warehouse: "Kho B - Kệ 5", current: 0,   min: 15, unit: "Cái",   lastIn: "01/04/2026", lastOut: "10/04/2026" },
  { id: "SP005", name: "SSD Samsung 970 EVO 1TB",    warehouse: "Kho C - Kệ 2", current: 56,  min: 20, unit: "Cái",   lastIn: "11/04/2026", lastOut: "15/04/2026" },
  { id: "SP006", name: "RAM Kingston 16GB DDR5",     warehouse: "Kho C - Kệ 2", current: 5,   min: 10, unit: "Thanh", lastIn: "05/04/2026", lastOut: "12/04/2026" },
  { id: "SP007", name: "Tai nghe Sony WH-1000XM5",  warehouse: "Kho A - Kệ 4", current: 33,  min: 5,  unit: "Cái",   lastIn: "09/04/2026", lastOut: "14/04/2026" },
  { id: "SP008", name: "Webcam Logitech C920",       warehouse: "Kho B - Kệ 3", current: 0,   min: 8,  unit: "Cái",   lastIn: "28/03/2026", lastOut: "07/04/2026" },
  { id: "SP009", name: "Hub USB-C Anker 7-in-1",    warehouse: "Kho B - Kệ 2", current: 88,  min: 15, unit: "Cái",   lastIn: "10/04/2026", lastOut: "15/04/2026" },
  { id: "SP010", name: "Card đồ họa RTX 4070",      warehouse: "Kho A - Kệ 2", current: 4,   min: 5,  unit: "Cái",   lastIn: "03/04/2026", lastOut: "11/04/2026" },
  { id: "SP011", name: "Ổ cứng WD Blue 2TB",        warehouse: "Kho C - Kệ 4", current: 72,  min: 20, unit: "Cái",   lastIn: "07/04/2026", lastOut: "13/04/2026" },
  { id: "SP012", name: "Bộ sạc Anker 65W GaN",      warehouse: "Kho B - Kệ 1", current: 0,   min: 20, unit: "Cái",   lastIn: "25/03/2026", lastOut: "05/04/2026" },
];

export const MOCK_LOGS: InventoryLog[] = [
  { id: "l1",  type: "adjust_decrease", productId: "SP004", productName: "Chuột Logitech MX Master 3", qty: 3,  warehouse: "Kho B - Kệ 5",                               reason: "Hàng hỏng / hết hạn",    note: "Phát hiện 3 cái bị vỡ vỏ khi kiểm kho",       createdAt: "09:15 14/04/2026", createdBy: "Admin" },
  { id: "l2",  type: "transfer",        productId: "SP005", productName: "SSD Samsung 970 EVO 1TB",    qty: 10, fromWarehouse: "Kho C", toWarehouse: "Kho A",             reason: "Chuyển kho nội bộ",       note: "Bổ sung cho Kho A trước đợt giao hàng",        createdAt: "08:40 14/04/2026", createdBy: "Admin" },
  { id: "l3",  type: "adjust_increase", productId: "SP003", productName: "Bàn phím cơ Keychron K8",   qty: 20, warehouse: "Kho B - Kệ 5",                               reason: "Kiểm kê phát hiện thừa",  note: "",                                              createdAt: "15:20 13/04/2026", createdBy: "Admin" },
  { id: "l4",  type: "adjust_decrease", productId: "SP008", productName: "Webcam Logitech C920",       qty: 5,  warehouse: "Kho B - Kệ 3",                               reason: "Mất mát",                 note: "Không tìm thấy sau kiểm kê định kỳ",           createdAt: "10:05 12/04/2026", createdBy: "Admin" },
  { id: "l5",  type: "transfer",        productId: "SP001", productName: "Laptop Dell XPS 15",         qty: 5,  fromWarehouse: "Kho B", toWarehouse: "Kho A",             reason: "Chuyển kho nội bộ",       note: "Theo yêu cầu đơn ORD-2026-089",                createdAt: "07:30 12/04/2026", createdBy: "Admin" },
  { id: "l6",  type: "adjust_decrease", productId: "SP012", productName: "Bộ sạc Anker 65W GaN",      qty: 8,  warehouse: "Kho B - Kệ 1",                               reason: "Kiểm kê phát hiện thiếu", note: "",                                              createdAt: "14:00 10/04/2026", createdBy: "Admin" },
  { id: "l7",  type: "transfer",        productId: "SP006", productName: "RAM Kingston 16GB DDR5",     qty: 30, fromWarehouse: "Kho A", toWarehouse: "Kho C",             reason: "Chuyển kho nội bộ",       note: "Cân bằng tồn kho giữa các kho",                createdAt: "11:00 09/04/2026", createdBy: "Admin" },
  { id: "l8",  type: "adjust_increase", productId: "SP010", productName: "Card đồ họa RTX 4070",      qty: 2,  warehouse: "Kho A - Kệ 2",                               reason: "Hàng trả về",             note: "Khách trả hàng đơn ORD-2026-084",              createdAt: "09:30 09/04/2026", createdBy: "Admin" },
  { id: "l9",  type: "adjust_decrease", productId: "SP002", productName: 'Màn hình LG 27" 4K',        qty: 1,  warehouse: "Kho A - Kệ 1",                               reason: "Hàng hỏng / hết hạn",    note: "Màn hình bị vỡ panel trong quá trình lưu kho", createdAt: "16:45 08/04/2026", createdBy: "Admin" },
  { id: "l10", type: "transfer",        productId: "SP009", productName: "Hub USB-C Anker 7-in-1",    qty: 15, fromWarehouse: "Kho A", toWarehouse: "Kho B",             reason: "Chuyển kho nội bộ",       note: "Kho B sắp hết cần bổ sung",                    createdAt: "08:00 07/04/2026", createdBy: "Admin" },
  { id: "l11", type: "adjust_increase", productId: "SP007", productName: "Tai nghe Sony WH-1000XM5", qty: 5,  warehouse: "Kho A - Kệ 4",                               reason: "Kiểm kê phát hiện thừa",  note: "",                                              createdAt: "14:20 06/04/2026", createdBy: "Admin" },
  { id: "l12", type: "adjust_decrease", productId: "SP011", productName: "Ổ cứng WD Blue 2TB",       qty: 4,  warehouse: "Kho C - Kệ 4",                               reason: "Hàng hỏng / hết hạn",    note: "Phát hiện lỗi bad sector khi kiểm tra",        createdAt: "10:10 05/04/2026", createdBy: "Admin" },
];
