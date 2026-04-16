import type { Warehouse } from "../types";

export const WAREHOUSES: Warehouse[] = [
  {
    id: "KA",
    name: "Kho A",
    address: "18 Duy Tân, Cầu Giấy, Hà Nội",
    manager: "Nguyễn Văn An",
    phone: "0901 234 567",
    totalArea: 1200,
    status: "active",
    features: ["Điều hoà", "Điện dự phòng", "PCCC"],
    zones: [
      { id: "KA-K1", name: "Kệ 1", type: "Điện tử cao cấp",   slots: 80,  used: 48, temp: "18–22°C" },
      { id: "KA-K2", name: "Kệ 2", type: "Linh kiện",         slots: 60,  used: 4,  temp: "20–25°C" },
      { id: "KA-K3", name: "Kệ 3", type: "Laptop & máy tính", slots: 50,  used: 48, temp: "18–22°C" },
      { id: "KA-K4", name: "Kệ 4", type: "Thiết bị âm thanh", slots: 40,  used: 33, temp: "20–25°C" },
      { id: "KA-K5", name: "Kệ 5", type: "Phụ kiện",          slots: 100, used: 62, temp: "20–25°C" },
    ],
  },
  {
    id: "KB",
    name: "Kho B",
    address: "72 Lê Văn Lương, Thanh Xuân, Hà Nội",
    manager: "Trần Thị Bình",
    phone: "0912 345 678",
    totalArea: 950,
    status: "active",
    features: ["Điện dự phòng", "PCCC", "Camera 24/7"],
    zones: [
      { id: "KB-K1", name: "Kệ 1", type: "Sạc & cáp",         slots: 150, used: 0,   temp: "20–25°C" },
      { id: "KB-K2", name: "Kệ 2", type: "Hub & bộ chuyển",   slots: 120, used: 88,  temp: "20–25°C" },
      { id: "KB-K3", name: "Kệ 3", type: "Webcam & micro",    slots: 60,  used: 0,   temp: "20–25°C" },
      { id: "KB-K4", name: "Kệ 4", type: "Phụ kiện di động",  slots: 80,  used: 55,  temp: "20–25°C" },
      { id: "KB-K5", name: "Kệ 5", type: "Bàn phím & chuột",  slots: 200, used: 124, temp: "20–25°C" },
    ],
  },
  {
    id: "KC",
    name: "Kho C",
    address: "45 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
    manager: "Lê Minh Châu",
    phone: "0933 456 789",
    totalArea: 800,
    status: "maintenance",
    features: ["Điều hoà", "PCCC"],
    zones: [
      { id: "KC-K1", name: "Kệ 1", type: "Bộ nhớ & lưu trữ", slots: 100, used: 61, temp: "18–22°C" },
      { id: "KC-K2", name: "Kệ 2", type: "SSD & RAM",         slots: 120, used: 61, temp: "18–22°C" },
      { id: "KC-K3", name: "Kệ 3", type: "Ổ cứng ngoài",     slots: 80,  used: 40, temp: "20–25°C" },
      { id: "KC-K4", name: "Kệ 4", type: "Linh kiện PC",      slots: 90,  used: 72, temp: "20–25°C" },
    ],
  },
];
