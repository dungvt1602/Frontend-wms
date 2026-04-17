# Kiến trúc hệ thống — WMS Frontend

Tài liệu mô tả kiến trúc tổng thể, cấu trúc thư mục và nhiệm vụ của từng thành phần trong project WMS Frontend.

---

## Tổng quan kiến trúc

```
Người dùng (Browser)
        │
        ▼
┌───────────────────────┐
│    Next.js 16         │  ← App Router, Server Components
│    (Frontend Layer)   │
│                       │
│  ┌─────────────────┐  │
│  │  Auth Routes    │  │  /login, /register
│  │  (auth)         │  │
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │ Dashboard Routes│  │  /dashboard, /inventory, ...
│  │  (dashboard)    │  │
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │   API Routes    │  │  /api/inventory, /api/orders
│  └─────────────────┘  │
└──────────┬────────────┘
           │ Axios (HTTP)
           ▼
┌───────────────────────┐
│    Backend API        │  ← http://localhost:8000/api
│    (Chưa triển khai)  │
└───────────────────────┘
```

---

## Luồng xác thực

```
/login hoặc /register
        │
        ▼
   LoginForm / RegisterForm
        │
        │ (TODO) next-auth signIn()
        ▼
   Backend API xác thực
        │
        ▼
   JWT Token → lưu session
        │
        ▼
   middleware.ts kiểm tra token
        │
   ┌────┴────┐
   │         │
   ✓ Hợp lệ  ✗ Không hợp lệ
   │         │
   ▼         ▼
Dashboard  /login
```

---

## Hệ thống Layout lồng nhau (Nested Layouts)

Next.js App Router sử dụng các `layout.tsx` lồng nhau để bọc nội dung trang. Mỗi trang chỉ cần lo **nội dung bên trong**, các lớp bên ngoài tự động được áp dụng.

```
src/app/
│
├── layout.tsx                    ← Lớp 1: ROOT - bọc TOÀN BỘ app
│                                   (html, body, font Inter, metadata)
│
├── (dashboard)/
│   ├── layout.tsx                ← Lớp 2: DASHBOARD - bọc tất cả trang trong dashboard
│   │                               (Sidebar + Header)
│   │
│   └── inventory/
│       └── page.tsx              ← Lớp 3: NỘI DUNG - chỉ lo phần nội dung trang
```

Khi người dùng truy cập `/inventory`, thực tế render như sau:

```
┌─────────────────────────────────────────┐
│  layout.tsx (Root)                      │
│  <html> <body> font Inter               │
│  ┌───────────────────────────────────┐  │
│  │  (dashboard)/layout.tsx           │  │
│  │  ┌──────────┬────────────────┐   │  │
│  │  │ Sidebar  │ Header         │   │  │
│  │  │          ├────────────────┤   │  │
│  │  │          │ inventory/     │   │  │
│  │  │          │ page.tsx       │   │  │
│  │  │          │ (nội dung)     │   │  │
│  │  └──────────┴────────────────┘   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

> **Quy tắc:** `page.tsx` chỉ viết nội dung bên trong. Sidebar và Header được `(dashboard)/layout.tsx` lo tự động cho **tất cả** các trang dashboard mà không cần lặp lại code.

---

## Phân lớp State Management

```
┌─────────────────────────────────────────────┐
│              STATE TRONG APP                │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  SERVER STATE (dữ liệu từ API)      │   │
│  │  → TanStack Query                   │   │
│  │  Inventory, Orders, Suppliers...    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  CLIENT STATE (UI)                  │   │
│  │  → Zustand                          │   │
│  │  sidebarOpen, user info...          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  LOCAL STATE                        │   │
│  │  → useState (React)                 │   │
│  │  Form input, modal open, loading... │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Cấu trúc thư mục chi tiết

```
wms-frontend/
│
├── src/
│   ├── app/                        # Next.js App Router — định nghĩa routes
│   │   │
│   │   ├── (auth)/                 # Route group: trang xác thực
│   │   │   │                       # Dấu () = nhóm route, KHÔNG ảnh hưởng URL
│   │   │   ├── layout.tsx          # Layout bọc login/register (full-screen)
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Route: /login
│   │   │   ├── register/
│   │   │   │   └── page.tsx        # Route: /register
│   │   │   └── logout/
│   │   │       └── page.tsx        # Route: /logout
│   │   │
│   │   ├── (dashboard)/            # Route group: các trang cần đăng nhập
│   │   │   ├── layout.tsx          # Layout bọc Sidebar + Header
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Route: /dashboard — Trang tổng quan
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx        # Route: /inventory — Danh sách tồn kho
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Route: /inventory/123 — Chi tiết sản phẩm
│   │   │   ├── orders/
│   │   │   │   └── page.tsx        # Route: /orders
│   │   │   ├── warehouse/
│   │   │   │   └── page.tsx        # Route: /warehouse
│   │   │   ├── suppliers/
│   │   │   │   └── page.tsx        # Route: /suppliers
│   │   │   ├── reports/
│   │   │   │   └── page.tsx        # Route: /reports
│   │   │   └── settings/
│   │   │       └── page.tsx        # Route: /settings
│   │   │
│   │   ├── api/                    # API Routes nội bộ Next.js (chạy server-side)
│   │   │   ├── inventory/
│   │   │   │   └── route.ts        # GET/POST /api/inventory
│   │   │   └── orders/
│   │   │       └── route.ts        # GET/POST /api/orders
│   │   │
│   │   ├── layout.tsx              # Root layout: font, html, body, metadata
│   │   ├── page.tsx                # Route: / → redirect sang /dashboard
│   │   └── globals.css             # CSS toàn cục, Tailwind imports, theme tokens
│   │
│   ├── components/                 # Components dùng chung toàn app
│   │   ├── ui/                     # Components shadcn/ui (base components)
│   │   │   ├── button.tsx          # Button với các variants
│   │   │   ├── card.tsx            # Card container
│   │   │   ├── input.tsx           # Input field
│   │   │   ├── badge.tsx           # Badge/tag
│   │   │   └── table.tsx           # Table components
│   │   ├── layout/                 # Components bố cục chính
│   │   │   ├── Sidebar.tsx         # Menu điều hướng trái, có thu gọn
│   │   │   └── Header.tsx          # Thanh trên: search, notification, user
│   │   ├── common/                 # Components tái sử dụng chung (LoadingSpinner, EmptyState...)
│   │   └── chatbot/                # Chatbot widget — xem chi tiết section "Chatbot"
│   │
│   ├── features/                   # Logic theo từng domain nghiệp vụ
│   │   ├── auth/                   # Xác thực người dùng
│   │   │   └── components/
│   │   │       ├── LoginForm.tsx   # Form đăng nhập
│   │   │       └── RegisterForm.tsx# Form đăng ký
│   │   ├── inventory/              # Quản lý tồn kho
│   │   │   ├── components/         # UI components riêng của inventory
│   │   │   ├── hooks/              # Custom hooks: useInventory, useUpdateStock...
│   │   │   ├── api/                # Hàm gọi API inventory
│   │   │   └── types/              # TypeScript types: Product, StockItem...
│   │   ├── orders/                 # Quản lý đơn hàng
│   │   ├── warehouse/              # Quản lý kho bãi
│   │   ├── suppliers/              # Nhà cung cấp
│   │   └── reports/                # Báo cáo & thống kê
│   │
│   ├── lib/                        # Thư viện tiện ích dùng chung
│   │   ├── api-client.ts           # Axios instance đã cấu hình sẵn baseURL + headers
│   │   ├── auth.ts                 # Cấu hình NextAuth (providers, callbacks)
│   │   └── utils.ts                # Hàm cn() để merge Tailwind class names
│   │
│   ├── hooks/                      # Custom React hooks dùng chung toàn app
│   │   └── (vd: useDebounce, useLocalStorage...)
│   │
│   ├── store/                      # Zustand global state
│   │   ├── index.ts                # Store chính: sidebarOpen, user info
│   │   └── ui.store.ts             # Store UI: theme, modal states
│   │
│   └── types/                      # TypeScript types dùng chung
│       └── index.ts                # ApiResponse<T>, UserRole, ...
│
├── middleware.ts                   # Chạy trước mọi request — kiểm tra auth token
├── next.config.ts                  # Cấu hình Next.js
├── components.json                 # Cấu hình shadcn/ui
├── postcss.config.mjs              # Cấu hình PostCSS cho Tailwind v4
├── tsconfig.json                   # Cấu hình TypeScript
├── .env.local                      # Biến môi trường (không commit lên git)
├── README.md                       # Hướng dẫn cài đặt và chạy project
└── ARCHITECTURE.md                 # Tài liệu kiến trúc (file này)
```

---

## Nhiệm vụ các thư mục chính

### `src/app/` — Routing Layer
Định nghĩa tất cả routes của ứng dụng theo Next.js App Router. Mỗi `page.tsx` là một route, mỗi `layout.tsx` bọc giao diện cho nhóm route đó.

### `src/components/` — Shared UI
Chứa components **không gắn với domain cụ thể**, dùng được ở mọi nơi trong app.
- `ui/` — Các component gốc từ shadcn (thay đổi ít)
- `layout/` — Sidebar, Header — khung giao diện chính
- `common/` — LoadingSpinner, EmptyState, Pagination...

### `src/features/` — Domain Logic
Kiến trúc **Feature-based**: mỗi nghiệp vụ (inventory, orders...) có đủ 4 lớp:
- `components/` — UI riêng của feature đó
- `hooks/` — Data fetching hooks (dùng TanStack Query)
- `api/` — Hàm gọi API qua `api-client.ts`
- `types/` — TypeScript interfaces của domain

### `src/lib/` — Utilities
Các hàm/config tiện ích được tái sử dụng:
- `api-client.ts` — Mọi chỗ gọi API đều import từ đây
- `auth.ts` — Cấu hình NextAuth tập trung
- `utils.ts` — `cn()` helper merge Tailwind classes

### `src/store/` — Global State (Zustand)
Chỉ lưu **client UI state** (không phải dữ liệu từ API):
- Trạng thái sidebar đóng/mở
- Thông tin user đang đăng nhập
- Cài đặt theme

### `src/types/` — TypeScript Definitions
Các interface/type **dùng chung** giữa nhiều features:
- `ApiResponse<T>` — Chuẩn response từ backend
- `UserRole` — Các vai trò trong hệ thống

### `src/hooks/` — Shared Hooks
Custom React hooks **không thuộc về feature cụ thể**:
- `useDebounce` — Delay search input
- `useLocalStorage` — Persist state xuống localStorage

---

## Quy tắc đặt tên

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Component | PascalCase | `LoginForm.tsx`, `Sidebar.tsx` |
| Hook | camelCase với `use` | `useInventory.ts` |
| Store | camelCase với `.store` | `ui.store.ts` |
| Type/Interface | PascalCase | `ApiResponse`, `UserRole` |
| Route page | `page.tsx` (cố định) | `src/app/(dashboard)/orders/page.tsx` |
| Route layout | `layout.tsx` (cố định) | `src/app/(dashboard)/layout.tsx` |

---

## Luồng gọi API Backend

Component không bao giờ gọi API trực tiếp. Mọi request đi qua **3 lớp**:

```
Component
  └── dùng hook (useInventory)
        └── hook gọi API function (getInventory)
              └── API function dùng api-client (axios)
                    └── Backend http://localhost:8000/api
```

| Lớp | Vị trí | Nhiệm vụ |
|---|---|---|
| `api-client.ts` | `src/lib/` | Axios config, JWT interceptor, base URL |
| `api/index.ts` | `src/features/{domain}/api/` | Hàm fetch / post / patch / delete |
| `useXxx.ts` | `src/features/{domain}/hooks/` | TanStack Query — cache, loading, error |
| Component | `src/features/{domain}/components/` | Chỉ gọi hook, không gọi API trực tiếp |

---

## Cấu trúc chi tiết từng Feature

---

### Feature: Inventory (`/inventory`)

```
src/
├── app/(dashboard)/inventory/
│   ├── page.tsx                      ← Trang chính — tabs: Tồn kho / Lịch sử điều chỉnh
│   └── [id]/
│       └── page.tsx                  ← (Dự phòng) Chi tiết tồn kho 1 mặt hàng
│
└── features/inventory/
    ├── types/
    │   └── index.ts
    │       ├── StockItem             ← id, name, warehouse, current, min, unit, lastIn, lastOut
    │       ├── StockStatus           ← "ok" | "low" | "out"
    │       ├── LogType               ← "adjust_increase" | "adjust_decrease" | "transfer"
    │       ├── InventoryLog          ← id, type, productId, qty, warehouse, reason, note, createdAt, createdBy
    │       └── getStatus()           ← helper: current + min → StockStatus
    │
    ├── components/
    │   ├── InventoryStats.tsx        ← 3 KPI card: Đủ hàng / Sắp hết / Hết hàng
    │   ├── InventoryFilters.tsx      ← Search + tab kho (A/B/C) + dropdown trạng thái
    │   ├── InventoryTable.tsx        ← Bảng tồn kho, progress bar, sort, shared Pagination
    │   ├── InventoryLogTable.tsx     ← Bảng lịch sử: Tăng / Giảm / Chuyển kho, badge màu
    │   ├── AdjustStockModal.tsx      ← Modal điều chỉnh tồn kho (tăng/giảm + lý do + log)
    │   └── TransferStockModal.tsx    ← Modal chuyển kho nội bộ (kho A→B, preview số lượng + log)
    │
    ├── hooks/                        ← (Chưa triển khai — chờ backend)
    └── api/                          ← (Chưa triển khai — chờ backend)
```

**Luồng tính năng:**
```
Tab "Tồn kho"           → InventoryStats + InventoryFilters + InventoryTable
Tab "Lịch sử (N)"       → InventoryLogTable (N = số log hiện có)

Button "Điều chỉnh"     → AdjustStockModal → onLog() → thêm vào đầu danh sách log
Button "Chuyển kho"     → TransferStockModal → onLog() → thêm vào đầu danh sách log
```

---

### Feature: Products (`/products`)

```
src/
├── app/(dashboard)/products/
│   ├── page.tsx                      ← Danh sách sản phẩm — filter, sort, phân trang
│   └── [id]/
│       └── page.tsx                  ← Chi tiết sản phẩm — form edit + tồn kho + lịch sử
│
└── features/products/
    ├── types/
    │   └── index.ts
    │       ├── Product               ← id, name, category, unit, buyPrice, sellPrice, supplier, status
    │       ├── StockByWarehouse      ← warehouse, current, min, capacity
    │       ├── ProductHistory        ← id, type, qty, orderId, warehouse, date, partner
    │       └── ProductDetail         ← extends Product + description + stock[] + history[]
    │
    ├── components/
    │   ├── ProductFilters.tsx        ← Search + tab danh mục + dropdown trạng thái
    │   ├── ProductTable.tsx          ← Bảng sản phẩm, context menu (Chỉnh sửa → /products/[id])
    │   ├── AddProductModal.tsx       ← Modal thêm sản phẩm mới (createPortal, validation)
    │   ├── ProductDetailHeader.tsx   ← Breadcrumb + badge trạng thái + nút Lưu/Huỷ
    │   ├── ProductInfoForm.tsx       ← Form edit: tên, danh mục, giá, đơn vị, NCC, mô tả, trạng thái
    │   ├── ProductStockInfo.tsx      ← Tồn kho theo từng kho, progress bar, cảnh báo sắp hết
    │   └── ProductHistoryTable.tsx   ← Lịch sử nhập/xuất: +/- số lượng, màu phân biệt
    │
    ├── hooks/                        ← (Chưa triển khai — chờ backend)
    └── api/                          ← (Chưa triển khai — chờ backend)
```

**Luồng tính năng:**
```
/products               → ProductFilters + ProductTable
  → hover row → ⋯      → context menu
    → "Chỉnh sửa"       → router.push("/products/SP001")
    → "Xoá sản phẩm"    → (TODO: confirm modal)

/products/[id]          → ProductDetailHeader
                           + ProductInfoForm   (col trái)
                           + ProductStockInfo  (col phải, 300px)
                           + ProductHistoryTable (full width)
  → "Lưu thay đổi"      → loading 900ms → "Đã lưu!"
  → "Huỷ"               → router.push("/products")

Button "+ Thêm SP"      → AddProductModal (createPortal) → validation → lưu
```

---

### Feature: Warehouse (`/warehouse`)

```
src/
├── app/(dashboard)/warehouse/
│   └── page.tsx                      ← Danh sách kho + banner bảo trì
│
└── features/warehouse/
    ├── types/
    │   └── index.ts
    │       ├── Zone                  ← id, name, type, slots, used, temp
    │       └── Warehouse             ← id, name, address, manager, phone, totalArea, status, features, zones[]
    │
    ├── components/
    │   ├── WarehouseStats.tsx        ← 4 KPI card: tổng kho, đang hoạt động, bảo trì, tổng diện tích
    │   └── WarehouseCard.tsx         ← Card accordion: thông tin kho + bảng zone với capacity bar
    │
    ├── hooks/                        ← (Chưa triển khai — chờ backend)
    └── api/                          ← (Chưa triển khai — chờ backend)
```

**Luồng tính năng:**
```
/warehouse              → WarehouseStats (tổng quan)
                          + WarehouseCard × N (mỗi kho 1 card)
                            → Click header card  → accordion mở/đóng
                            → Bảng zone          → capacity bar, badge trạng thái
                          + Banner cảnh báo bảo trì (nếu có kho maintenance)
```

**Trạng thái kho (`Warehouse.status`):**
| Giá trị | Ý nghĩa |
|---|---|
| `active` | Đang hoạt động bình thường |
| `maintenance` | Đang bảo trì, hạn chế nhập/xuất |
| `inactive` | Tạm ngừng hoạt động |

---

### Chatbot Widget (`components/chatbot/`)

Widget chat AI nổi ở góc phải dưới màn hình, dùng chung cho toàn bộ dashboard.

```
src/components/chatbot/
│
├── index.tsx                 ← Entry point — portal wrapper + ghép ChatWindow + FABButton
├── ChatWindow.tsx            ← Cửa sổ chat: Header + MessageList + SuggestedPrompts + ChatInput
├── MessageList.tsx           ← Render danh sách MessageBubble + TypingIndicator
├── MessageBubble.tsx         ← 1 bubble (avatar + nội dung, hỗ trợ **bold**)
├── TypingIndicator.tsx       ← 3 chấm bounce khi bot đang "nghĩ"
├── SuggestedPrompts.tsx      ← Pill buttons gợi ý, ẩn sau khi user nhắn tin đầu tiên
├── ChatInput.tsx             ← Textarea + nút Send, Enter gửi / Shift+Enter xuống dòng
├── FABButton.tsx             ← Nút tròn góc phải + dot online + badge unread
│
├── hooks/
│   └── useChat.ts            ← Toàn bộ logic: state, effects, send(), reset(), handleKey()
│
├── lib/
│   └── api.ts                ← fetchReply() — gọi backend hoặc trả mock khi chưa có API
│
└── types.ts                  ← interface Message { id, role, content, createdAt }
```

**Luồng dữ liệu:**
```
index.tsx (portal)
  └── useChat()              ← quản lý toàn bộ state
        ├── fetchReply()     ← gọi POST /chat → nhận { content }
        └── state: messages, input, loading, unread, open
  ├── ChatWindow             ← nhận props từ useChat, không có state riêng
  │   ├── MessageList → MessageBubble × N
  │   ├── TypingIndicator    ← hiện khi loading = true
  │   ├── SuggestedPrompts   ← hiện khi chưa có tin user
  │   └── ChatInput          ← gọi onSend() / onKeyDown()
  └── FABButton              ← toggle open, hiện badge unread
```

**Kết nối backend:**
```env
# .env.local
NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:8080/api
```

```
POST {API_URL}/chat
Body:     { messages: [{ role: "user"|"assistant", content: string }] }
Response: { content: string }
```
Tương thích với **Spring AI** (`ChatClient`) và **FastAPI + LangChain RAG**.

**Lưu ý hydration:** `index.tsx` dùng `mounted` state + `useEffect` để đảm bảo `createPortal(document.body)` chỉ chạy trên client, tránh lỗi SSR mismatch.

---

## Nguyên tắc kiến trúc

1. **Server State** → TanStack Query (cache, refetch tự động)
2. **Client UI State** → Zustand (sidebar, theme...)
3. **Local State** → useState (form, modal, loading)
4. **Không** nhét dữ liệu API vào Zustand
5. **Feature-first**: mỗi domain tự chứa đủ components, hooks, api, types của nó
6. **Import alias**: dùng `@/` thay vì đường dẫn tương đối `../../`
7. **Component không gọi API trực tiếp** — luôn đi qua hook → api function → api-client
