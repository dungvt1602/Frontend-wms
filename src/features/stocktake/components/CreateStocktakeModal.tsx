"use client";

import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateStocktakeData {
  warehouseName: string;
  assignedTo: string;
  scheduledDate: string;
  note: string;
}

interface CreateStocktakeModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateStocktakeData) => void;
}

const WAREHOUSES = [
  { value: "Kho A - TP.HCM", label: "Kho A - TP.HCM" },
  { value: "Kho B - Hà Nội", label: "Kho B - Hà Nội" },
  { value: "Kho C - Đà Nẵng", label: "Kho C - Đà Nẵng" },
];

const TODAY = new Date().toISOString().split("T")[0];

const INITIAL_FORM: CreateStocktakeData = {
  warehouseName: "",
  assignedTo: "",
  scheduledDate: "",
  note: "",
};

interface FieldError {
  warehouseName?: string;
  assignedTo?: string;
  scheduledDate?: string;
}

function validate(data: CreateStocktakeData): FieldError {
  const errors: FieldError = {};
  if (!data.warehouseName) errors.warehouseName = "Vui lòng chọn kho kiểm kê.";
  if (!data.scheduledDate) errors.scheduledDate = "Vui lòng chọn ngày kiểm kê.";
  if (!data.assignedTo.trim()) errors.assignedTo = "Vui lòng nhập người phụ trách.";
  return errors;
}

export default function CreateStocktakeModal({
  open,
  onClose,
  onCreate,
}: CreateStocktakeModalProps) {
  const [form, setForm] = useState<CreateStocktakeData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldError>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    onCreate(form);
    onClose();
  }

  if (!mounted || !open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="create-stocktake-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
        >
          <h2
            id="create-stocktake-title"
            className="text-lg font-semibold text-white"
          >
            Tạo phiên kiểm kê mới
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-150"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">
            {/* Kho kiểm kê */}
            <div>
              <label
                htmlFor="warehouseName"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Kho kiểm kê <span className="text-red-500">*</span>
              </label>
              <select
                id="warehouseName"
                name="warehouseName"
                value={form.warehouseName}
                onChange={handleChange}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition",
                  errors.warehouseName
                    ? "border-red-400"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <option value="">-- Chọn kho --</option>
                {WAREHOUSES.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
              {errors.warehouseName && (
                <p className="mt-1 text-xs text-red-500">{errors.warehouseName}</p>
              )}
            </div>

            {/* Ngày kiểm kê */}
            <div>
              <label
                htmlFor="scheduledDate"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Ngày kiểm kê <span className="text-red-500">*</span>
              </label>
              <input
                id="scheduledDate"
                type="date"
                name="scheduledDate"
                value={form.scheduledDate}
                min={TODAY}
                onChange={handleChange}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition",
                  errors.scheduledDate
                    ? "border-red-400"
                    : "border-slate-200 hover:border-slate-300"
                )}
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-xs text-red-500">{errors.scheduledDate}</p>
              )}
            </div>

            {/* Người phụ trách */}
            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Người phụ trách <span className="text-red-500">*</span>
              </label>
              <input
                id="assignedTo"
                type="text"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                placeholder="Nhập tên người phụ trách"
                className={cn(
                  "w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 bg-white",
                  "placeholder:text-slate-400",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition",
                  errors.assignedTo
                    ? "border-red-400"
                    : "border-slate-200 hover:border-slate-300"
                )}
              />
              {errors.assignedTo && (
                <p className="mt-1 text-xs text-red-500">{errors.assignedTo}</p>
              )}
            </div>

            {/* Ghi chú */}
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Ghi chú{" "}
                <span className="text-slate-400 font-normal">(tùy chọn)</span>
              </label>
              <textarea
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Nhập ghi chú nếu có..."
                rows={3}
                className={cn(
                  "w-full rounded-xl border border-slate-200 hover:border-slate-300 px-3.5 py-2.5",
                  "text-sm text-slate-800 bg-white placeholder:text-slate-400 resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                )}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 active:opacity-100 transition-opacity duration-150"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              Tạo phiên
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
