"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Loader2, Warehouse,
  Mail, Lock, Package, TrendingUp, Truck, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Dữ liệu tĩnh cho panel trái ─── */
const stats = [
  { icon: Package,    value: "12,480", label: "Sản phẩm trong kho" },
  { icon: Truck,      value: "340",    label: "Đơn xuất hôm nay" },
  { icon: TrendingUp, value: "98.2%",  label: "Độ chính xác" },
  { icon: Users,      value: "56",     label: "Nhân viên hoạt động" },
];

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [errors, setErrors]             = useState<FormErrors>({});

  function validate(): boolean {
    const e: FormErrors = {};
    if (!email.trim())                               e.email    = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email không hợp lệ";
    if (!password.trim())                            e.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6)                   e.password = "Mật khẩu tối thiểu 6 ký tự";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await new Promise((res) => setTimeout(res, 1500)); // TODO: next-auth signIn()
      router.push("/");
    } catch {
      setErrors({ general: "Email hoặc mật khẩu không đúng. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ════════════════════════════════
          LEFT — Branding & Stats Panel
      ════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
           style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full"
               style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full"
               style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
               style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
            <Warehouse className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none tracking-wide">WMS</p>
            <p className="text-indigo-300/70 text-[11px] mt-0.5 tracking-wider uppercase">Warehouse Management</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300"
                 style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Hệ thống đang hoạt động
            </div>
            <h1 className="text-[2.4rem] font-bold leading-tight text-white">
              Quản lý kho hàng<br />
              <span style={{ background: "linear-gradient(90deg, #818cf8, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                thông minh hơn.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Nền tảng WMS toàn diện — kiểm soát tồn kho, đơn hàng và kho bãi
              theo thời gian thực, mọi lúc mọi nơi.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label}
                   className="rounded-xl p-4 space-y-2"
                   style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                       style={{ background: "rgba(99,102,241,0.2)" }}>
                    <Icon className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} WMS Corp · Phiên bản 2.4.1
        </p>
      </div>

      {/* ════════════════════════════════
          RIGHT — Login Form
      ════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-[360px] space-y-7">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">WMS</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-[1.6rem] font-bold text-slate-900 tracking-tight">
              Chào mừng trở lại 👋
            </h2>
            <p className="text-slate-400 text-sm">Nhập thông tin để truy cập hệ thống</p>
          </div>

          {/* Error banner */}
          {errors.general && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-700"
                 style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">!</span>
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="ten@congty.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                  className={cn(
                    "w-full h-11 pl-10 pr-4 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all",
                    "border bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10",
                    errors.email
                      ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/10"
                      : "border-slate-200"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center text-[9px] font-bold">✕</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <button type="button"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={cn(
                    "w-full h-11 pl-10 pr-11 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all",
                    "border bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10",
                    errors.password
                      ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/10"
                      : "border-slate-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center text-[9px] font-bold">✕</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                  remember
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white border-slate-300 group-hover:border-indigo-400"
                )}>
                  {remember && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-600">Ghi nhớ đăng nhập</span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200",
                "flex items-center justify-center gap-2",
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              )}
              style={{ background: isLoading ? "#6366f1" : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: isLoading ? "none" : "0 4px 15px rgba(99,102,241,0.4)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : "Đăng nhập"}
            </button>
          </form>

          {/* Bottom */}
          <p className="text-center text-xs text-slate-400">
            Gặp sự cố?{" "}
            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Liên hệ quản trị viên
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}
