import type { Message } from "../types";

const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL ?? "";

export const SUGGESTIONS = [
  "Tồn kho hiện tại như thế nào?",
  "Sản phẩm nào sắp hết hàng?",
  "Tổng đơn hàng tháng này?",
  "Kho nào đang gần đầy?",
];

export const GREETING =
  "Xin chào! Tôi là **WMS Assistant** 👋\n\nTôi có thể giúp bạn:\n• Kiểm tra tồn kho\n• Theo dõi đơn hàng\n• Xem tình trạng kho bãi\n\nBạn cần hỗ trợ gì?";

export const isConnected = !!API_URL;

/* ── mock replies khi chưa có backend ── */
function mockReply(q: string): string {
  if (q.includes("tồn kho") || q.includes("hàng"))
    return "📦 Hiện tại hệ thống có **12 sản phẩm** đang được theo dõi. **2 sản phẩm** (Chuột Logitech MX Master 3, Webcam Logitech C920) đang **hết hàng**, và **3 sản phẩm** sắp dưới mức tối thiểu.\n\n_(Kết nối backend để nhận dữ liệu thực tế)_";
  if (q.includes("đơn hàng") || q.includes("order"))
    return "📋 Tháng này có **11 đơn hàng** (5 nhập kho, 6 xuất kho). Tổng giá trị xuất kho ước tính **~850 triệu ₫**.\n\n_(Kết nối backend để nhận dữ liệu thực tế)_";
  if (q.includes("kho") && (q.includes("đầy") || q.includes("công suất")))
    return "🏭 **Kho A – Kệ 3** đang ở **96% công suất** (gần đầy). **Kho B – Kệ 1 & 3** hiện đang trống hoàn toàn.\n\n_(Kết nối backend để nhận dữ liệu thực tế)_";
  return "Xin chào! Tôi là WMS Assistant 🤖\n\nTôi có thể giúp bạn tra cứu tồn kho, tình trạng đơn hàng, và thông tin kho bãi.\n\n_(Chức năng AI đầy đủ sẽ hoạt động khi kết nối Spring AI / FastAPI + RAG)_";
}

/* ── gọi API thật hoặc trả về mock ── */
export async function fetchReply(messages: Message[]): Promise<string> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    return data.content ?? data.message ?? "Xin lỗi, tôi không hiểu câu hỏi này.";
  }

  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
  const q = messages[messages.length - 1]?.content.toLowerCase() ?? "";
  return mockReply(q);
}
