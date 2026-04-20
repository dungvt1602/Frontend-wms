"use client";

import { FileText, ClipboardList, Clock, CheckCircle, TrendingUp } from "lucide-react";

interface StocktakeStatsProps {
  total: number;
  draft: number;
  counting: number;
  pendingApproval: number;
  completed: number;
}

export default function StocktakeStats({
  total,
  draft,
  counting,
  pendingApproval,
  completed,
}: StocktakeStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Tổng phiên */}
      <div className="relative overflow-hidden rounded-2xl p-5 text-white"
           style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              Tổng
            </span>
          </div>
          <p className="text-3xl font-bold leading-none">{total}</p>
          <p className="text-sm text-indigo-200 mt-1">Tổng phiên kiểm kê</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-indigo-200">
            <span className="text-white font-medium">{draft}</span> nháp •{" "}
            <span className="text-white font-medium">{counting}</span> đang kiểm
          </div>
        </div>
      </div>

      {/* Đang kiểm */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="absolute right-0 top-0 w-20 h-20 bg-blue-50 rounded-bl-[40px]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ClipboardList size={18} className="text-blue-600" />
            </div>
            {counting > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-slate-800 leading-none">{counting}</p>
          <p className="text-sm text-slate-500 mt-1">Đang kiểm kê</p>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all"
                 style={{ width: total > 0 ? `${(counting / total) * 100}%` : "0%" }} />
          </div>
        </div>
      </div>

      {/* Chờ duyệt */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="absolute right-0 top-0 w-20 h-20 bg-amber-50 rounded-bl-[40px]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
            {pendingApproval > 0 && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Cần duyệt
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-slate-800 leading-none">{pendingApproval}</p>
          <p className="text-sm text-slate-500 mt-1">Chờ phê duyệt</p>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all"
                 style={{ width: total > 0 ? `${(pendingApproval / total) * 100}%` : "0%" }} />
          </div>
        </div>
      </div>

      {/* Hoàn tất */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="absolute right-0 top-0 w-20 h-20 bg-green-50 rounded-bl-[40px]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp size={12} />
              <span className="font-medium">
                {total > 0 ? Math.round((completed / total) * 100) : 0}%
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 leading-none">{completed}</p>
          <p className="text-sm text-slate-500 mt-1">Đã hoàn tất</p>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all"
                 style={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }} />
          </div>
        </div>
      </div>

    </div>
  );
}
