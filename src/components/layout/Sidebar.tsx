"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Warehouse, LayoutDashboard, Package, ShoppingBag, ClipboardList,
  Building2, Users, UserRound, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Tổng quan",      href: "/dashboard"  },
  { icon: Package,         label: "Tồn kho",        href: "/inventory"  },
  { icon: ShoppingBag,     label: "Sản phẩm",       href: "/products"   },
  { icon: ClipboardList,   label: "Đơn hàng",       href: "/orders"     },
  { icon: Building2,       label: "Kho bãi",        href: "/warehouse"  },
  { icon: Users,           label: "Nhà cung cấp",   href: "/suppliers"  },
  { icon: UserRound,       label: "Khách hàng",     href: "/customers"  },
  { icon: BarChart3,       label: "Báo cáo",        href: "/reports"    },
  { icon: Settings,        label: "Cài đặt",        href: "/settings"   },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "relative flex flex-col h-screen bg-slate-900 transition-all duration-300 ease-in-out flex-shrink-0",
      collapsed ? "w-[68px]" : "w-[220px]"
    )}>

      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 border-b border-slate-800",
        collapsed && "justify-center px-0"
      )}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
          <Warehouse className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-none">WMS</p>
            <p className="text-slate-500 text-[10px] mt-0.5">Warehouse Mgmt</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden px-2">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={collapsed ? label : undefined}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="h-4.5 w-4.5 flex-shrink-0" size={18} />
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-2 space-y-0.5">
        <button
          onClick={() => router.push("/logout")}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Đăng xuất" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin</p>
              <p className="text-slate-500 text-[10px] truncate">admin@wms.com</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all z-10"
      >
        {collapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft  size={12} />}
      </button>
    </aside>
  );
}
