"use client";

import { use, useState } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle, AlertTriangle,
  Building2, User, Calendar, FileText,
  ClipboardList, ScanLine, Camera, Save,
} from "lucide-react";
import { MOCK_STOCKTAKES } from "@/features/stocktake/data/mock";
import { Stocktake, StocktakeItem, StocktakeStatus } from "@/features/stocktake/types";
import { cn } from "@/lib/utils";
import ManualMode   from "@/features/stocktake/components/ManualMode";
import ScannerMode  from "@/features/stocktake/components/ScannerMode";
import CameraMode   from "@/features/stocktake/components/CameraMode";

// ─── Types ───────────────────────────────────────────────────────────────────

type InputMode = "manual" | "scanner" | "camera";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StocktakeStatus, { label: string; dot: string; cls: string }> = {
  draft:            { label: "Nháp",       dot: "bg-slate-400",              cls: "bg-slate-100 text-slate-600 border-slate-200"  },
  counting:         { label: "Đang kiểm",  dot: "bg-blue-500 animate-pulse", cls: "bg-blue-50 text-blue-700 border-blue-200"      },
  pending_approval: { label: "Chờ duyệt",  dot: "bg-amber-500",              cls: "bg-amber-50 text-amber-700 border-amber-200"   },
  completed:        { label: "Hoàn tất",   dot: "bg-green-500",              cls: "bg-green-50 text-green-700 border-green-200"   },
  cancelled:        { label: "Đã hủy",     dot: "bg-red-400",                cls: "bg-red-50 text-red-600 border-red-200"         },
};

function StatusBadge({ status }: { status: StocktakeStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", c.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />
      {c.label}
    </span>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-indigo-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Mode tab button ──────────────────────────────────────────────────────────

const MODE_TABS: { value: InputMode; icon: React.ElementType; label: string; desc: string }[] = [
  { value: "manual",  icon: ClipboardList, label: "Nhập tay",          desc: "Điền số lượng trực tiếp vào bảng"         },
  { value: "scanner", icon: ScanLine,      label: "Scanner cầm tay",   desc: "Kết nối máy quét USB / Bluetooth"          },
  { value: "camera",  icon: Camera,        label: "Quét camera",        desc: "Dùng camera thiết bị để quét QR / barcode" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StocktakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = use(params);
  const router   = useRouter();
  const initial  = MOCK_STOCKTAKES.find((s) => s.id === id) || null;

  const { confirm, modal } = useConfirm();

  const [session,    setSession]    = useState<Stocktake | null>(initial);
  const [localItems, setLocalItems] = useState<StocktakeItem[]>(initial?.items ?? []);
  const [mode,       setMode]       = useState<InputMode>("manual");
  const [isEditing,  setIsEditing]  = useState(false);

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-500">
        <AlertTriangle size={48} className="text-amber-400" />
        <p className="text-lg font-semibold">Không tìm thấy phiên kiểm kê</p>
        <button onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const canEdit   = session.status === "draft" || session.status === "counting";
  const counted   = localItems.filter((i) => i.actualQty !== null).length;
  const total     = localItems.length;
  const matchCnt  = localItems.filter((i) => i.actualQty !== null && i.actualQty === i.systemQty).length;
  const shortCnt  = localItems.filter((i) => i.actualQty !== null && i.actualQty < i.systemQty).length;
  const overCnt   = localItems.filter((i) => i.actualQty !== null && i.actualQty > i.systemQty).length;
  const hasCounts = session.status !== "draft" || counted > 0;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function startEditing() {
    if (session.status === "draft")
      setSession((p) => p ? { ...p, status: "counting" } : p);
    setIsEditing(true);
  }

  function handleQtyChange(productId: string, value: string) {
    const parsed = value === "" ? null : Number(value);
    setLocalItems((prev) =>
      prev.map((i) => i.productId === productId ? { ...i, actualQty: parsed } : i)
    );
  }

  function handleNoteChange(productId: string, value: string) {
    setLocalItems((prev) =>
      prev.map((i) => i.productId === productId ? { ...i, note: value } : i)
    );
  }

  // Called by ScannerMode & CameraMode when a barcode is confirmed
  function handleItemScanned(productId: string, qty: number, note: string) {
    if (session.status === "draft")
      setSession((p) => p ? { ...p, status: "counting" } : p);
    setLocalItems((prev) =>
      prev.map((i) => i.productId === productId ? { ...i, actualQty: qty, note } : i)
    );
  }

  async function handleSaveProgress() {
    const ok = await confirm({
      title: "Lưu tiến độ?",
      description: "Tiến độ sẽ được ghi nhận, phiên vẫn ở trạng thái Đang kiểm.",
      confirmLabel: "Lưu",
      cancelLabel: "Huỷ",
      variant: "primary",
      details: [{ label: "Đã nhập", value: `${counted} / ${total} mặt hàng` }],
    });
    if (!ok) return;
    setSession((p) => p ? { ...p, items: localItems } : p);
    setIsEditing(false);
  }

  async function handleSubmitApproval() {
    const ok = await confirm({
      title: "Gửi duyệt phiên kiểm kê?",
      description: "Phiên sẽ chuyển sang trạng thái Chờ duyệt và không thể chỉnh sửa thêm.",
      confirmLabel: "Gửi duyệt",
      cancelLabel: "Huỷ",
      variant: "warning",
      details: [
        { label: "Đã nhập", value: `${counted} / ${total} mặt hàng` },
        { label: "Chênh lệch", value: `${shortCnt} thiếu, ${overCnt} thừa`, highlight: true },
      ],
    });
    if (!ok) return;
    setSession((p) => p ? { ...p, items: localItems, status: "pending_approval" } : p);
    setIsEditing(false);
  }

  async function handleApprove() {
    const ok = await confirm({
      title: "Duyệt & cập nhật tồn kho?",
      description: "Hệ thống sẽ tự động điều chỉnh tồn kho theo kết quả kiểm kê. Không thể hoàn tác.",
      confirmLabel: "Duyệt",
      cancelLabel: "Huỷ",
      variant: "success",
      details: [
        { label: "Khớp", value: `${matchCnt} mặt hàng` },
        { label: "Thiếu", value: `${shortCnt} mặt hàng`, highlight: shortCnt > 0 },
        { label: "Thừa",  value: `${overCnt} mặt hàng`,  highlight: overCnt > 0  },
      ],
    });
    if (!ok) return;
    setSession((p) => p ? { ...p, status: "completed", completedAt: new Date().toISOString() } : p);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-slate-50 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Back */}
        <button onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Quay lại
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800">{session.code}</h1>
              <StatusBadge status={session.status} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{session.warehouseName}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {session.status === "pending_approval" && (
              <button onClick={handleApprove}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold shadow-sm hover:bg-green-700 transition-colors">
                <CheckCircle size={16} /> Duyệt & Cập nhật tồn
              </button>
            )}
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard icon={Building2} label="Kho"        value={session.warehouseName} />
          <InfoCard icon={User}      label="Phụ trách"  value={session.assignedTo}    />
          <InfoCard icon={Calendar}  label="Ngày kiểm"  value={session.scheduledDate} />
          <InfoCard icon={FileText}  label="Tiến độ"    value={`${counted} / ${total} mặt hàng`} />
        </div>

        {/* Summary stats */}
        {hasCounts && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-slate-700">{matchCnt}</p>
              <p className="text-xs text-slate-500 mt-0.5">Khớp hệ thống</p>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{shortCnt}</p>
              <p className="text-xs text-red-500 mt-0.5">Thiếu</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{overCnt}</p>
              <p className="text-xs text-green-600 mt-0.5">Thừa</p>
            </div>
          </div>
        )}

        {/* Note */}
        {session.note && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
            <span className="font-semibold">Ghi chú: </span>{session.note}
          </div>
        )}

        {/* ── Mode switcher (only when can edit) ── */}
        {canEdit && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Chọn chế độ nhập liệu</p>
              {/* Show start/editing indicator */}
              {mode === "manual" && !isEditing && (
                <button onClick={startEditing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm"
                        style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                  <ClipboardList size={15} /> Bắt đầu nhập
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {MODE_TABS.map(({ value, icon: Icon, label, desc }) => (
                <button
                  key={value}
                  onClick={() => { setMode(value); if (value !== "manual") startEditing(); }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all text-center",
                    mode === value
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-slate-100 bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    mode === value ? "bg-indigo-600 text-white" : "bg-white text-slate-500"
                  )}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className={cn("text-xs font-semibold", mode === value ? "text-indigo-700" : "text-slate-700")}>
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Mode content ── */}
        {mode === "manual" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <ManualMode
              items={localItems}
              canEdit={canEdit && isEditing}
              onQtyChange={handleQtyChange}
              onNoteChange={handleNoteChange}
            />
          </div>
        )}

        {mode === "scanner" && canEdit && (
          <ScannerMode items={localItems} onItemScanned={handleItemScanned} />
        )}

        {mode === "camera" && canEdit && (
          <CameraMode items={localItems} onItemScanned={handleItemScanned} />
        )}

        {/* Read-only table for scanner/camera modes (show progress) */}
        {(mode === "scanner" || mode === "camera") && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
              <p className="text-sm font-semibold text-slate-700">Danh sách mặt hàng — tiến độ</p>
            </div>
            <ManualMode
              items={localItems}
              canEdit={false}
              onQtyChange={() => {}}
              onNoteChange={() => {}}
            />
          </div>
        )}

      </div>

      {/* ── Sticky footer (manual mode only) ── */}
      {mode === "manual" && isEditing && canEdit && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Đã nhập <span className="font-bold text-slate-800">{counted}</span> / {total} mặt hàng
            </p>
            <div className="flex items-center gap-2">
              <button onClick={handleSaveProgress}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                <Save size={15} /> Lưu tiến độ
              </button>
              <button onClick={handleSubmitApproval}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm"
                      style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                <CheckCircle size={15} /> Hoàn thành & Gửi duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {modal}
    </div>
  );
}
