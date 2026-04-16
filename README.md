# WMS Frontend — Warehouse Management System

Hệ thống quản lý kho hàng (WMS) được xây dựng bằng **Next.js 16**, **Tailwind CSS v4** và **shadcn/ui**. Giao diện hiện đại, phân quyền theo vai trò, hỗ trợ quản lý tồn kho, đơn hàng, kho bãi và báo cáo thống kê.

---

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Next.js | 16.2.3 | Framework chính (App Router) |
| React | 19 | UI Library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | 4.2 | Component library |
| Zustand | 5 | Global state (UI state) |
| TanStack Query | 5 | Server state / Data fetching |
| Axios | 1.15 | HTTP client |
| NextAuth.js | v5 beta | Xác thực người dùng |
| Lucide React | 1.8 | Icon library |

---

## Yêu cầu hệ thống

- **Node.js** >= 18
- **npm** >= 9

---

## Cài đặt & Chạy

```bash
# 1. Clone project
git clone <repo-url>
cd wms-frontend

# 2. Cài dependencies
npm install

# 3. Tạo file môi trường
cp .env.example .env.local
# Chỉnh sửa .env.local với thông tin backend

# 4. Chạy môi trường development
npm run dev
```

Mở trình duyệt tại **http://localhost:3000**

---

## Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra lỗi ESLint
```

---

## Biến môi trường (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api   # URL backend API
NEXTAUTH_SECRET=your-secret-here                # Khóa bí mật NextAuth
NEXTAUTH_URL=http://localhost:3000              # URL ứng dụng
```

---

## Tính năng đã triển khai

- [x] Trang đăng nhập (Login) — split-screen, validation, show/hide password
- [x] Trang đăng ký (Register) — multi-field, password strength meter, vai trò WMS
- [x] Dashboard home — KPI cards, bar chart, activity feed, recent orders table
- [x] Sidebar điều hướng — có thể thu gọn, active state
- [x] Header — search, notification dropdown, user menu, profile modal
- [x] Hiệu ứng chuyển trang mượt (fade + slide)
- [x] Quản lý tồn kho (Inventory) — bảng tồn kho, filter, sort, pagination
- [x] Danh mục sản phẩm (Products) — bảng sản phẩm, filter theo danh mục, sort giá
- [x] Quản lý kho bãi (Warehouse) — accordion card, zone table, capacity bar

## Tính năng đang phát triển

- [ ] Quản lý đơn hàng (Orders)
- [ ] Quản lý nhà cung cấp (Suppliers)
- [ ] Báo cáo & thống kê (Reports)
- [ ] Tích hợp NextAuth với backend thật
- [ ] Phân quyền theo vai trò (RBAC)

---

## Cách gọi API Backend

Khi tích hợp với backend, tuân theo luồng **3 lớp** sau — component không bao giờ gọi API trực tiếp.

```
Component → Hook (TanStack Query) → API function → api-client (Axios) → Backend
```

### Lớp 1 — `src/lib/api-client.ts`

Axios instance dùng chung toàn app. Cấu hình một lần, tự động gắn JWT token vào mọi request.

```ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8000/api
  headers: { "Content-Type": "application/json" },
});

// Tự động gắn JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
```

### Lớp 2 — `src/features/{domain}/api/index.ts`

Hàm gọi API thô, mỗi domain có file riêng. Không xử lý cache hay loading ở đây.

```ts
// src/features/inventory/api/index.ts
import apiClient from "@/lib/api-client";
import type { StockItem } from "../types";

export const getInventory = () =>
  apiClient.get<StockItem[]>("/inventory");

export const importStock = (data: Partial<StockItem>) =>
  apiClient.post("/inventory/import", data);

export const updateStock = (id: string, qty: number) =>
  apiClient.patch(`/inventory/${id}`, { qty });
```

### Lớp 3 — `src/features/{domain}/hooks/useXxx.ts`

TanStack Query bọc ngoài API function — tự động cache, loading state, error handling và refetch.

```ts
// src/features/inventory/hooks/useInventory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventory, updateStock } from "../api";

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory().then((r) => r.data),
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      updateStock(id, qty),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventory"] }), // tự refetch sau khi update
  });
}
```

### Dùng trong component

```ts
// Component chỉ biết hook, không biết URL hay axios
const { data, isLoading, error } = useInventory();
const { mutate: update } = useUpdateStock();
```

### Quy tắc

| Lớp | Vị trí | Nhiệm vụ |
|---|---|---|
| `api-client.ts` | `src/lib/` | Axios config, JWT interceptor, base URL |
| `api/index.ts` | `src/features/{domain}/api/` | Hàm fetch / post / patch / delete |
| `useXxx.ts` | `src/features/{domain}/hooks/` | TanStack Query — cache, loading, error |
| Component | `src/features/{domain}/components/` | Chỉ gọi hook, không gọi API trực tiếp |

---

## Cấu trúc URL

| Route | Trang |
|---|---|
| `/` | Redirect → `/dashboard` |
| `/login` | Trang đăng nhập |
| `/register` | Trang đăng ký |
| `/dashboard` | Tổng quan kho hàng |
| `/inventory` | Danh sách tồn kho |
| `/inventory/:id` | Chi tiết sản phẩm |
| `/orders` | Danh sách đơn hàng |
| `/warehouse` | Quản lý kho bãi |
| `/suppliers` | Nhà cung cấp |
| `/reports` | Báo cáo |
| `/settings` | Cài đặt hệ thống |
