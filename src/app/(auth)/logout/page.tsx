"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Warehouse, Loader2, ShieldCheck } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"confirm" | "loading" | "done">("confirm");

  useEffect(() => {
    if (step === "done") {
      const t = setTimeout(() => router.replace("/login"), 1500);
      return () => clearTimeout(t);
    }
  }, [step, router]);

  const handleLogout = async () => {
    setStep("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStep("done");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
         style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

      {/* ── Decorative blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob tím trái trên */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
             style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        {/* Blob xanh phải dưới */}
        <div className="absolute -bottom-40 -right-24 w-[420px] h-[420px] rounded-full opacity-15"
             style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        {/* Blob đỏ giữa — gợi ý "thoát" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #f43f5e 0%, transparent 70%)" }} />

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating dots */}
        {[
          { top: "18%",  left: "12%",  size: 6,  opacity: 0.25 },
          { top: "72%",  left: "8%",   size: 4,  opacity: 0.15 },
          { top: "30%",  left: "88%",  size: 5,  opacity: 0.2  },
          { top: "80%",  left: "82%",  size: 7,  opacity: 0.18 },
          { top: "55%",  left: "20%",  size: 3,  opacity: 0.12 },
          { top: "12%",  left: "65%",  size: 5,  opacity: 0.2  },
        ].map((d, i) => (
          <div key={i} className="absolute rounded-full bg-white"
               style={{ top: d.top, left: d.left, width: d.size, height: d.size, opacity: d.opacity }} />
        ))}
      </div>

      {/* ── Card ── */}
      <div className="relative w-full max-w-sm">
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
             style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)" }}>

          {/* Top glow stripe */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />

          <div className="px-8 py-9 text-center">

            {/* Icon */}
            <div className="flex justify-center mb-6">
              {step === "done" ? (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                     style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
                  <ShieldCheck size={34} className="text-white" />
                </div>
              ) : (
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                       style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 8px 30px rgba(99,102,241,0.45)" }}>
                    <Warehouse size={34} className="text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#1e1b4b]"
                       style={{ background: "linear-gradient(135deg,#f43f5e,#e11d48)", boxShadow: "0 4px 12px rgba(244,63,94,0.5)" }}>
                    <LogOut size={14} className="text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Text */}
            {step === "confirm" && (
              <>
                <h1 className="text-xl font-bold text-white tracking-tight">Đăng xuất?</h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Bạn sẽ thoát khỏi hệ thống WMS.<br />
                  Mọi thay đổi chưa lưu sẽ bị mất.
                </p>
              </>
            )}
            {step === "loading" && (
              <>
                <h1 className="text-xl font-bold text-white tracking-tight">Đang đăng xuất...</h1>
                <p className="text-sm text-slate-400 mt-2">Vui lòng chờ trong giây lát</p>
              </>
            )}
            {step === "done" && (
              <>
                <h1 className="text-xl font-bold text-white tracking-tight">Đã đăng xuất!</h1>
                <p className="text-sm text-slate-400 mt-2">
                  Hẹn gặp lại 👋<br />
                  Đang chuyển về trang đăng nhập...
                </p>
              </>
            )}

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {step === "confirm" && (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg,#f43f5e,#e11d48)", boxShadow: "0 4px 16px rgba(244,63,94,0.45)" }}
                  >
                    <LogOut size={15} /> Xác nhận đăng xuất
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full h-11 rounded-xl text-sm font-medium transition-all hover:bg-white/10 active:scale-[0.98]"
                    style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    Quay lại
                  </button>
                </>
              )}

              {step === "loading" && (
                <div className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm"
                     style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                  <Loader2 size={15} className="animate-spin" />
                  Đang xử lý...
                </div>
              )}

              {step === "done" && (
                <div className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-emerald-300"
                     style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <ShieldCheck size={15} />
                  Đang chuyển hướng...
                </div>
              )}
            </div>
          </div>

          {/* Bottom glow stripe */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] mt-5" style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} WMS — Warehouse Management System
        </p>
      </div>
    </div>
  );
}
