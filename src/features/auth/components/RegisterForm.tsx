"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Loader2, Warehouse,
  User, Mail, Lock, Phone, Briefcase,
  CheckCircle2, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Vai trò trong hệ thống WMS ─── */
const roles = [
  { value: "warehouse_staff", label: "Nhân viên kho" },
  { value: "manager",         label: "Quản lý kho" },
  { value: "accountant",      label: "Kế toán kho" },
  { value: "admin",           label: "Quản trị viên" },
];

/* ─── Quy trình 3 bước bên trái ─── */
const steps = [
  {
    num: "01",
    title: "Tạo tài khoản",
    desc: "Điền thông tin cá nhân và vai trò trong hệ thống",
  },
  {
    num: "02",
    title: "Xét duyệt",
    desc: "Quản trị viên xác nhận quyền truy cập trong vòng 24h",
  },
  {
    num: "03",
    title: "Bắt đầu làm việc",
    desc: "Truy cập đầy đủ tính năng theo phân quyền vai trò",
  },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  agreed?: string;
  general?: string;
}

const INIT: FormState = {
  fullName: "", email: "", phone: "",
  role: "", password: "", confirmPassword: "", agreed: false,
};

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm]         = useState<FormState>(INIT);
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [isLeaving, setIsLeaving] = useState(false);

  function navigate(path: string) {
    setIsLeaving(true);
    setTimeout(() => router.push(path), 350);
  }

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.fullName.trim())
      e.fullName = "Vui lòng nhập họ và tên";
    else if (form.fullName.trim().length < 3)
      e.fullName = "Họ tên tối thiểu 3 ký tự";

    if (!form.email.trim())
      e.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email không hợp lệ";

    if (form.phone && !/^(0|\+84)[0-9]{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Số điện thoại không hợp lệ";

    if (!form.role)
      e.role = "Vui lòng chọn vai trò";

    if (!form.password)
      e.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 8)
      e.password = "Mật khẩu tối thiểu 8 ký tự";
    else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "Cần ít nhất 1 chữ hoa và 1 số";

    if (!form.confirmPassword)
      e.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Mật khẩu không khớp";

    if (!form.agreed)
      e.agreed = "Bạn cần đồng ý với điều khoản sử dụng";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* Độ mạnh mật khẩu */
  function pwStrength(pw: string): { level: number; label: string; color: string } {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { level: score, label: "Yếu",    color: "#ef4444" };
    if (score <= 3) return { level: score, label: "Trung bình", color: "#f59e0b" };
    return           { level: score, label: "Mạnh",   color: "#10b981" };
  }

  const strength = pwStrength(form.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await new Promise((res) => setTimeout(res, 1800)); // TODO: API call
      setSuccess(true);
    } catch {
      setErrors({ general: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    } finally {
      setLoading(false);
    }
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-sm space-y-5">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Đăng ký thành công!</h2>
            <p className="text-slate-500 text-sm mt-2">
              Tài khoản của bạn đang chờ xét duyệt. Quản trị viên sẽ
              xác nhận trong vòng <strong>24 giờ</strong>.
            </p>
          </div>
          <div className="rounded-xl p-4 text-left text-sm space-y-1"
               style={{ background: "#f5f3ff", border: "1px solid #e0e7ff" }}>
            <p className="text-slate-500">Email đăng ký</p>
            <p className="font-semibold text-indigo-700">{form.email}</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 4px 15px rgba(99,102,241,0.35)" }}
          >
            Về trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex transition-all duration-300 ease-in-out",
      isLeaving ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
    )}>

      {/* ════════════ LEFT — Branding ════════════ */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden"
           style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)" }}>

        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full"
               style={{ background: "radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)" }} />
          <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full"
               style={{ background: "radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
            <Warehouse className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base tracking-wide">WMS</p>
            <p className="text-indigo-300/70 text-[11px] tracking-wider uppercase">Warehouse Management</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300"
                 style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Đăng ký tài khoản mới
            </div>
            <h1 className="text-[2.2rem] font-bold leading-tight text-white">
              Bắt đầu quản lý<br />
              <span style={{ background: "linear-gradient(90deg,#818cf8,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                kho hàng ngay.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Tạo tài khoản và được cấp quyền truy cập vào toàn bộ hệ thống
              quản lý kho theo vai trò của bạn.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-start gap-4">
                {/* Line connector */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                       style={{ background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.4)" }}>
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-6 mt-1" style={{ background: "rgba(99,102,241,0.2)" }} />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} WMS Corp · Phiên bản 2.4.1
        </p>
      </div>

      {/* ════════════ RIGHT — Register Form ════════════ */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-10 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-6">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">WMS</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-[1.5rem] font-bold text-slate-900 tracking-tight">
              Tạo tài khoản
            </h2>
            <p className="text-slate-400 text-sm">
              Đã có tài khoản?{" "}
              <button type="button" onClick={() => navigate("/login")}
                      className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Đăng nhập ngay
              </button>
            </p>
          </div>

          {/* Error banner */}
          {errors.general && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-700"
                 style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold">!</span>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* ── Họ và tên ── */}
            <Field label="Họ và tên" error={errors.fullName} required>
              <InputIcon icon={<User className="h-4 w-4" />}>
                <input
                  type="text" placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  disabled={isLoading} autoComplete="name"
                  className={inputCls(!!errors.fullName)}
                />
              </InputIcon>
            </Field>

            {/* ── Email ── */}
            <Field label="Email công ty" error={errors.email} required>
              <InputIcon icon={<Mail className="h-4 w-4" />}>
                <input
                  type="email" placeholder="ten@congty.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  disabled={isLoading} autoComplete="email"
                  className={inputCls(!!errors.email)}
                />
              </InputIcon>
            </Field>

            {/* ── Phone + Role (2 cột) ── */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Số điện thoại" error={errors.phone}>
                <InputIcon icon={<Phone className="h-4 w-4" />}>
                  <input
                    type="tel" placeholder="0912 345 678"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    disabled={isLoading} autoComplete="tel"
                    className={inputCls(!!errors.phone)}
                  />
                </InputIcon>
              </Field>

              <Field label="Vai trò" error={errors.role} required>
                <div className="relative group">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" />
                  <select
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      inputCls(!!errors.role),
                      "appearance-none cursor-pointer",
                      !form.role && "text-slate-400"
                    )}
                  >
                    <option value="" disabled>Chọn vai trò</option>
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </Field>
            </div>

            {/* ── Mật khẩu ── */}
            <Field label="Mật khẩu" error={errors.password} required>
              <InputIcon icon={<Lock className="h-4 w-4" />}>
                <input
                  type={showPw ? "text" : "password"} placeholder="Tối thiểu 8 ký tự"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  disabled={isLoading} autoComplete="new-password"
                  className={cn(inputCls(!!errors.password), "pr-11")}
                />
              </InputIcon>
              <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}
                      className="absolute right-3.5 top-[34px] text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {/* Password strength bar */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
                           style={{ background: n <= strength.level ? strength.color : "#e2e8f0" }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </Field>

            {/* ── Xác nhận mật khẩu ── */}
            <Field label="Xác nhận mật khẩu" error={errors.confirmPassword} required>
              <InputIcon icon={<Lock className="h-4 w-4" />}>
                <input
                  type={showCpw ? "text" : "password"} placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  disabled={isLoading} autoComplete="new-password"
                  className={cn(inputCls(!!errors.confirmPassword), "pr-11")}
                />
              </InputIcon>
              <button type="button" onClick={() => setShowCpw(!showCpw)} tabIndex={-1}
                      className="absolute right-3.5 top-[34px] text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showCpw ? "Ẩn" : "Hiện"}>
                {showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </Field>

            {/* ── Điều khoản ── */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" className="sr-only"
                         checked={form.agreed}
                         onChange={(e) => set("agreed", e.target.checked)} />
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                    form.agreed
                      ? "bg-indigo-600 border-indigo-600"
                      : errors.agreed
                        ? "border-red-400 bg-red-50"
                        : "bg-white border-slate-300 group-hover:border-indigo-400"
                  )}>
                    {form.agreed && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600 leading-snug">
                  Tôi đồng ý với{" "}
                  <button type="button" className="text-indigo-600 hover:underline font-medium">
                    Điều khoản sử dụng
                  </button>{" "}
                  và{" "}
                  <button type="button" className="text-indigo-600 hover:underline font-medium">
                    Chính sách bảo mật
                  </button>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-xs text-red-500 pl-6">{errors.agreed}</p>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit" disabled={isLoading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-semibold text-white",
                "flex items-center justify-center gap-2 transition-all duration-200",
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              )}
              style={{
                background: "linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)",
                boxShadow: isLoading ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
              }}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Đang tạo tài khoản...</>
              ) : "Tạo tài khoản"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════
   Helper components (internal)
════════════════════════════════════════ */

function Field({
  label, error, required, children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 relative">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0">✕</span>
          {error}
        </p>
      )}
    </div>
  );
}

function InputIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full h-11 pl-10 pr-4 rounded-xl text-sm text-slate-900",
    "placeholder:text-slate-400 outline-none transition-all border",
    "bg-slate-50 focus:bg-white focus:ring-3",
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/10"
      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
  );
}
