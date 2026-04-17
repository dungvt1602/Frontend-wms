"use client";

import { useState } from "react";
import {
  Settings, Bell, Warehouse, ShieldCheck, Database,
  Globe, Clock, Monitor, Check, ChevronRight,
  Building2, AlertTriangle, Mail, MessageSquare,
  Key, Smartphone, Activity, Download, Trash2,
  ToggleLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ══════════ Types ══════════ */
type Tab = "general" | "notifications" | "warehouse" | "security" | "data";

/* ══════════ Toggle component ══════════ */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
        checked ? "bg-indigo-600" : "bg-slate-200"
      )}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}

/* ══════════ SaveBar ══════════ */
function SaveBar({ dirty, onSave, saving, saved }: {
  dirty: boolean; onSave: () => void; saving: boolean; saved: boolean;
}) {
  if (!dirty && !saving && !saved) return null;
  return (
    <div className={cn(
      "flex items-center justify-between px-5 py-3 rounded-xl border text-sm transition-all",
      saved
        ? "bg-emerald-50 border-emerald-200"
        : "bg-indigo-50 border-indigo-200"
    )}>
      <p className={saved ? "text-emerald-700 font-medium" : "text-indigo-700"}>
        {saved ? "✓ Đã lưu thành công!" : "Bạn có thay đổi chưa lưu"}
      </p>
      {!saved && (
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
        >
          {saving
            ? <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Đang lưu...</>
            : <><Check size={13} /> Lưu thay đổi</>
          }
        </button>
      )}
    </div>
  );
}

/* ══════════ Section wrapper ══════════ */
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  );
}

/* ══════════ Row variants ══════════ */
function RowToggle({ icon: Icon, label, sub, checked, onChange }: {
  icon: React.ElementType; label: string; sub?: string;
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function RowSelect({ icon: Icon, label, sub, value, options, onChange }: {
  icon: React.ElementType; label: string; sub?: string;
  value: string; options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0 mr-4">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-slate-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 rounded-xl text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer flex-shrink-0"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function RowInput({ icon: Icon, label, sub, value, onChange, type = "text", suffix }: {
  icon: React.ElementType; label: string; sub?: string;
  value: string; onChange: (v: string) => void;
  type?: string; suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0 mr-4">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-slate-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all w-32 text-right"
        />
        {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

function RowAction({ icon: Icon, label, sub, actionLabel, onClick, danger }: {
  icon: React.ElementType; label: string; sub?: string;
  actionLabel: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          danger ? "bg-red-50" : "bg-slate-100")}>
          <Icon size={15} className={danger ? "text-red-500" : "text-slate-500"} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <button
        onClick={onClick}
        className={cn(
          "h-8 px-4 rounded-lg text-xs font-semibold border transition-all flex-shrink-0",
          danger
            ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
            : "text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
        )}
      >
        {actionLabel}
      </button>
    </div>
  );
}

/* ══════════════════════════════════
   Main Page
══════════════════════════════════ */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  /* ── General ── */
  const [lang,     setLang]     = useState("vi");
  const [timezone, setTimezone] = useState("asia-hcm");
  const [theme,    setTheme]    = useState("light");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [companyName, setCompanyName] = useState("WMS Corp");
  const [generalDirty, setGeneralDirty] = useState(false);
  const [generalSaving, setGeneralSaving] = useState(false);
  const [generalSaved,  setGeneralSaved]  = useState(false);

  /* ── Notifications ── */
  const [notifLowStock,   setNotifLowStock]   = useState(true);
  const [notifNewOrder,   setNotifNewOrder]   = useState(true);
  const [notifOrderDone,  setNotifOrderDone]  = useState(true);
  const [notifEmail,      setNotifEmail]      = useState(false);
  const [notifSms,        setNotifSms]        = useState(false);
  const [notifDirty, setNotifDirty] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved,  setNotifSaved]  = useState(false);

  /* ── Warehouse ── */
  const [defaultWarehouse, setDefaultWarehouse] = useState("kho-a");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [autoTransfer, setAutoTransfer] = useState(false);
  const [warehouseDirty, setWarehouseDirty] = useState(false);
  const [warehouseSaving, setWarehouseSaving] = useState(false);
  const [warehouseSaved,  setWarehouseSaved]  = useState(false);

  /* ── Security ── */
  const [twoFactor,    setTwoFactor]    = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [loginLog,     setLoginLog]     = useState(true);
  const [securityDirty, setSecurityDirty] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securitySaved,  setSecuritySaved]  = useState(false);

  /* ── Save helpers ── */
  const makeSave = (
    setSaving: (v: boolean) => void,
    setSaved:  (v: boolean) => void,
    setDirty:  (v: boolean) => void,
  ) => async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const markDirty = (setter: (v: boolean) => void) => () => setter(true);

  /* ── Sidebar nav ── */
  const tabs: { key: Tab; icon: React.ElementType; label: string }[] = [
    { key: "general",       icon: Settings,    label: "Chung"          },
    { key: "notifications", icon: Bell,        label: "Thông báo"      },
    { key: "warehouse",     icon: Warehouse,   label: "Kho bãi"        },
    { key: "security",      icon: ShieldCheck, label: "Bảo mật"        },
    { key: "data",          icon: Database,    label: "Dữ liệu"        },
  ];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Cài đặt</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tuỳ chỉnh hệ thống theo nhu cầu vận hành</p>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Sidebar nav ── */}
        <div className="w-52 flex-shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="py-2">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all",
                  activeTab === key
                    ? "text-indigo-700 bg-indigo-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={16} className={activeTab === key ? "text-indigo-600" : "text-slate-400"} />
                {label}
                {activeTab === key && (
                  <ChevronRight size={14} className="ml-auto text-indigo-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ════ GENERAL ════ */}
          {activeTab === "general" && (
            <>
              <Section title="Thông tin công ty" desc="Tên và thông tin cơ bản hiển thị trên hệ thống">
                <RowInput
                  icon={Building2} label="Tên công ty" sub="Hiển thị trên header và báo cáo"
                  value={companyName}
                  onChange={(v) => { setCompanyName(v); setGeneralDirty(true); }}
                />
              </Section>

              <Section title="Giao diện & Ngôn ngữ" desc="Tuỳ chỉnh hiển thị theo sở thích">
                <RowSelect
                  icon={Globe} label="Ngôn ngữ" sub="Ngôn ngữ hiển thị toàn hệ thống"
                  value={lang} options={[
                    { value: "vi", label: "Tiếng Việt" },
                    { value: "en", label: "English" },
                  ]}
                  onChange={(v) => { setLang(v); setGeneralDirty(true); }}
                />
                <RowSelect
                  icon={Monitor} label="Giao diện" sub="Chủ đề màu sắc"
                  value={theme} options={[
                    { value: "light", label: "Sáng (Light)" },
                    { value: "dark",  label: "Tối (Dark)" },
                    { value: "auto",  label: "Theo hệ thống" },
                  ]}
                  onChange={(v) => { setTheme(v); setGeneralDirty(true); }}
                />
                <RowSelect
                  icon={Clock} label="Múi giờ" sub="Dùng để tính thời gian giao dịch"
                  value={timezone} options={[
                    { value: "asia-hcm",    label: "Asia/Ho_Chi_Minh (UTC+7)" },
                    { value: "asia-hn",     label: "Asia/Hanoi (UTC+7)" },
                    { value: "asia-sg",     label: "Asia/Singapore (UTC+8)" },
                    { value: "asia-tokyo",  label: "Asia/Tokyo (UTC+9)" },
                  ]}
                  onChange={(v) => { setTimezone(v); setGeneralDirty(true); }}
                />
                <RowSelect
                  icon={ToggleLeft} label="Định dạng ngày" sub="Áp dụng cho toàn bộ bảng và báo cáo"
                  value={dateFormat} options={[
                    { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
                    { value: "mm/dd/yyyy", label: "MM/DD/YYYY" },
                    { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
                  ]}
                  onChange={(v) => { setDateFormat(v); setGeneralDirty(true); }}
                />
              </Section>

              <SaveBar dirty={generalDirty} onSave={makeSave(setGeneralSaving, setGeneralSaved, setGeneralDirty)}
                       saving={generalSaving} saved={generalSaved} />
            </>
          )}

          {/* ════ NOTIFICATIONS ════ */}
          {activeTab === "notifications" && (
            <>
              <Section title="Cảnh báo hệ thống" desc="Thông báo hiển thị trong ứng dụng">
                <RowToggle
                  icon={AlertTriangle} label="Tồn kho dưới mức tối thiểu"
                  sub="Cảnh báo khi hàng sắp hết hoặc đã hết"
                  checked={notifLowStock}
                  onChange={(v) => { setNotifLowStock(v); setNotifDirty(true); }}
                />
                <RowToggle
                  icon={Activity} label="Đơn hàng mới"
                  sub="Thông báo khi có đơn nhập / xuất được tạo"
                  checked={notifNewOrder}
                  onChange={(v) => { setNotifNewOrder(v); setNotifDirty(true); }}
                />
                <RowToggle
                  icon={Check} label="Đơn hàng hoàn tất"
                  sub="Thông báo khi đơn hàng chuyển sang trạng thái Hoàn thành"
                  checked={notifOrderDone}
                  onChange={(v) => { setNotifOrderDone(v); setNotifDirty(true); }}
                />
              </Section>

              <Section title="Kênh thông báo" desc="Nơi nhận thông báo ngoài ứng dụng">
                <RowToggle
                  icon={Mail} label="Gửi qua Email"
                  sub="Nhận email tóm tắt hàng ngày và cảnh báo quan trọng"
                  checked={notifEmail}
                  onChange={(v) => { setNotifEmail(v); setNotifDirty(true); }}
                />
                <RowToggle
                  icon={MessageSquare} label="Gửi qua SMS"
                  sub="Chỉ áp dụng cho cảnh báo khẩn cấp (hết hàng, lỗi hệ thống)"
                  checked={notifSms}
                  onChange={(v) => { setNotifSms(v); setNotifDirty(true); }}
                />
              </Section>

              <SaveBar dirty={notifDirty} onSave={makeSave(setNotifSaving, setNotifSaved, setNotifDirty)}
                       saving={notifSaving} saved={notifSaved} />
            </>
          )}

          {/* ════ WAREHOUSE ════ */}
          {activeTab === "warehouse" && (
            <>
              <Section title="Kho mặc định" desc="Áp dụng khi tạo đơn hàng hoặc điều chỉnh tồn kho">
                <RowSelect
                  icon={Warehouse} label="Kho mặc định" sub="Kho được chọn sẵn trong các form tạo mới"
                  value={defaultWarehouse} options={[
                    { value: "kho-a", label: "Kho A — Hà Nội" },
                    { value: "kho-b", label: "Kho B — TP.HCM" },
                    { value: "kho-c", label: "Kho C — Đà Nẵng" },
                  ]}
                  onChange={(v) => { setDefaultWarehouse(v); setWarehouseDirty(true); }}
                />
              </Section>

              <Section title="Ngưỡng cảnh báo" desc="Quy tắc tự động phát hiện sản phẩm cần nhập thêm">
                <RowInput
                  icon={AlertTriangle} label="Ngưỡng tồn kho tối thiểu mặc định"
                  sub="Áp dụng cho sản phẩm chưa có ngưỡng riêng"
                  value={lowStockThreshold}
                  type="number"
                  suffix="đơn vị"
                  onChange={(v) => { setLowStockThreshold(v); setWarehouseDirty(true); }}
                />
              </Section>

              <Section title="Tự động hoá" desc="Các quy tắc xử lý tự động">
                <RowToggle
                  icon={Activity} label="Tự động đề xuất chuyển kho"
                  sub="Khi kho A hết hàng, hệ thống gợi ý chuyển từ kho còn hàng"
                  checked={autoTransfer}
                  onChange={(v) => { setAutoTransfer(v); setWarehouseDirty(true); }}
                />
              </Section>

              <SaveBar dirty={warehouseDirty} onSave={makeSave(setWarehouseSaving, setWarehouseSaved, setWarehouseDirty)}
                       saving={warehouseSaving} saved={warehouseSaved} />
            </>
          )}

          {/* ════ SECURITY ════ */}
          {activeTab === "security" && (
            <>
              <Section title="Xác thực" desc="Bảo vệ tài khoản khỏi truy cập trái phép">
                <RowToggle
                  icon={Smartphone} label="Xác thực 2 bước (2FA)"
                  sub="Yêu cầu mã OTP mỗi lần đăng nhập"
                  checked={twoFactor}
                  onChange={(v) => { setTwoFactor(v); setSecurityDirty(true); }}
                />
                <RowToggle
                  icon={Activity} label="Ghi lịch sử đăng nhập"
                  sub="Lưu IP, thiết bị và thời gian mỗi lần đăng nhập"
                  checked={loginLog}
                  onChange={(v) => { setLoginLog(v); setSecurityDirty(true); }}
                />
              </Section>

              <Section title="Phiên đăng nhập" desc="Kiểm soát thời gian giữ phiên">
                <RowSelect
                  icon={Clock} label="Tự động đăng xuất"
                  sub="Đăng xuất khi không hoạt động trong thời gian này"
                  value={sessionTimeout} options={[
                    { value: "30",  label: "30 phút" },
                    { value: "60",  label: "1 giờ"   },
                    { value: "120", label: "2 giờ"   },
                    { value: "480", label: "8 giờ"   },
                    { value: "0",   label: "Không tự đăng xuất" },
                  ]}
                  onChange={(v) => { setSessionTimeout(v); setSecurityDirty(true); }}
                />
              </Section>

              <Section title="Mật khẩu" desc="Quản lý thông tin đăng nhập">
                <RowAction
                  icon={Key} label="Đổi mật khẩu"
                  sub="Cập nhật mật khẩu định kỳ để tăng bảo mật"
                  actionLabel="Đổi ngay"
                  onClick={() => {}}
                />
              </Section>

              <SaveBar dirty={securityDirty} onSave={makeSave(setSecuritySaving, setSecuritySaved, setSecurityDirty)}
                       saving={securitySaving} saved={securitySaved} />
            </>
          )}

          {/* ════ DATA ════ */}
          {activeTab === "data" && (
            <>
              <Section title="Xuất dữ liệu" desc="Tải xuống bản sao dữ liệu hệ thống">
                <RowAction
                  icon={Download} label="Xuất toàn bộ tồn kho"
                  sub="File Excel chứa danh sách tất cả sản phẩm và số lượng"
                  actionLabel="Xuất Excel"
                  onClick={() => {}}
                />
                <RowAction
                  icon={Download} label="Xuất lịch sử đơn hàng"
                  sub="Tất cả đơn nhập / xuất theo thời gian"
                  actionLabel="Xuất Excel"
                  onClick={() => {}}
                />
                <RowAction
                  icon={Download} label="Xuất báo cáo tháng"
                  sub="Tổng hợp doanh thu và biến động tháng hiện tại"
                  actionLabel="Xuất PDF"
                  onClick={() => {}}
                />
              </Section>

              <Section title="Sao lưu" desc="Tạo bản backup dữ liệu hệ thống">
                <RowAction
                  icon={Database} label="Tạo backup thủ công"
                  sub="Lưu toàn bộ dữ liệu vào file nén"
                  actionLabel="Tạo ngay"
                  onClick={() => {}}
                />
                <RowSelect
                  icon={Clock} label="Tự động backup" sub="Lên lịch sao lưu định kỳ"
                  value="daily" options={[
                    { value: "daily",   label: "Hàng ngày" },
                    { value: "weekly",  label: "Hàng tuần" },
                    { value: "monthly", label: "Hàng tháng" },
                    { value: "off",     label: "Tắt" },
                  ]}
                  onChange={() => {}}
                />
              </Section>

              <Section title="Vùng nguy hiểm" desc="Các thao tác không thể khôi phục, hãy cân nhắc kỹ">
                <RowAction
                  icon={Trash2} label="Xoá toàn bộ lịch sử điều chỉnh tồn kho"
                  sub="Dữ liệu log sẽ bị xoá vĩnh viễn, không thể hoàn tác"
                  actionLabel="Xoá dữ liệu"
                  onClick={() => {}}
                  danger
                />
                <RowAction
                  icon={Trash2} label="Đặt lại hệ thống về mặc định"
                  sub="Xoá tất cả cài đặt, sản phẩm, đơn hàng và kho"
                  actionLabel="Reset hệ thống"
                  onClick={() => {}}
                  danger
                />
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
