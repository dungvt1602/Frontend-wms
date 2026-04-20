"use client";

import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, Trash2 } from "lucide-react";

export type ConfirmVariant = "primary" | "danger" | "warning" | "success";

export interface ConfirmDetail {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ConfirmConfig {
  title: string;
  description?: string;
  details?: ConfirmDetail[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmModalProps extends ConfirmConfig {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CFG = {
  primary: {
    iconBg:  "bg-indigo-50",
    icon:    <Info size={26} className="text-indigo-500" />,
    btnCls:  "",
    btnStyle:{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" },
    bar:     "from-indigo-500 to-indigo-600",
  },
  danger: {
    iconBg:  "bg-red-50",
    icon:    <Trash2 size={26} className="text-red-500" />,
    btnCls:  "bg-red-600 hover:bg-red-700",
    btnStyle:{},
    bar:     "from-red-500 to-red-600",
  },
  warning: {
    iconBg:  "bg-amber-50",
    icon:    <AlertTriangle size={26} className="text-amber-500" />,
    btnCls:  "",
    btnStyle:{ background: "linear-gradient(135deg,#f59e0b,#d97706)" },
    bar:     "from-amber-400 to-amber-500",
  },
  success: {
    iconBg:  "bg-green-50",
    icon:    <CheckCircle2 size={26} className="text-green-500" />,
    btnCls:  "bg-green-600 hover:bg-green-700",
    btnStyle:{},
    bar:     "from-green-500 to-green-600",
  },
} satisfies Record<ConfirmVariant, object>;

export default function ConfirmModal({
  open, onConfirm, onCancel,
  title, description, details = [],
  confirmLabel = "Đồng ý",
  cancelLabel  = "Từ chối",
  variant      = "primary",
}: ConfirmModalProps) {
  if (!open) return null;

  const cfg = VARIANT_CFG[variant];

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
         onClick={onCancel}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden"
        style={{ animation: "confirmIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className={cn("h-1 w-full bg-gradient-to-r", cfg.bar)} />

        {/* Body */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", cfg.iconBg)}>
            {cfg.icon}
          </div>
          <h3 className="text-base font-bold text-slate-800 leading-snug">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Detail rows */}
        {details.length > 0 && (
          <div className="mx-6 mb-4 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden divide-y divide-slate-100">
            {details.map((d, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500">{d.label}</span>
                <span className={cn(
                  "font-medium text-right max-w-[180px] truncate",
                  d.highlight ? "text-indigo-600 font-semibold" : "text-slate-800"
                )}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90",
              cfg.btnCls
            )}
            style={cfg.btnStyle as React.CSSProperties}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmIn {
          from { opacity: 0; transform: scale(.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)  translateY(0);    }
        }
      `}</style>
    </div>,
    document.body
  );
}
