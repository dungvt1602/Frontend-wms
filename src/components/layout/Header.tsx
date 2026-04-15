"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileModal from "@/features/auth/components/ProfileModal";

const notifications = [
  { id: 1, text: "Tồn kho SP001 dưới mức tối thiểu", time: "5 phút trước", unread: true  },
  { id: 2, text: "Đơn hàng #ORD-2024-089 đã xuất kho", time: "20 phút trước", unread: true  },
  { id: 3, text: "Nhà cung cấp Minh Phát đã xác nhận đơn", time: "1 giờ trước", unread: false },
];

export default function Header() {
  const [showNotif,    setShowNotif]    = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0">

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Tìm sản phẩm, đơn hàng..."
          className="w-full h-9 pl-9 pr-4 rounded-xl text-sm bg-slate-100 border border-transparent text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
            )}
          </button>

          {showNotif && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Thông báo</p>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <div className="divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div key={n.id}
                         className={cn("px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors", n.unread && "bg-indigo-50/40")}>
                      <div className="flex items-start gap-2.5">
                        {n.unread && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
                        <div className={cn(!n.unread && "pl-4")}>
                          <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <button className="text-xs text-indigo-600 font-medium hover:underline">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">Admin</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Quản trị viên</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 overflow-hidden py-1">
                <button
                  onClick={() => { setShowProfile(false); setShowProfileModal(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <User size={15} />
                  Hồ sơ cá nhân
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings size={15} />
                  Cài đặt
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile modal — backdrop blur */}
      <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </header>
  );
}
