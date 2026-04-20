"use client";

import { cn } from "@/lib/utils";
import { StocktakeItem } from "../types";

interface ManualModeProps {
  items: StocktakeItem[];
  canEdit: boolean;
  onQtyChange: (productId: string, value: string) => void;
  onNoteChange: (productId: string, value: string) => void;
}

function getDiff(item: StocktakeItem): number | null {
  if (item.actualQty === null) return null;
  return item.actualQty - item.systemQty;
}

function formatNum(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString("vi-VN");
}

export default function ManualMode({
  items,
  canEdit,
  onQtyChange,
  onNoteChange,
}: ManualModeProps) {
  const entered = items.filter((i) => i.actualQty !== null).length;
  const notEntered = items.length - entered;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm">
        <span className="text-slate-600">
          Tổng:{" "}
          <span className="font-semibold text-slate-800">{items.length}</span>{" "}
          mặt hàng
        </span>
        <span className="text-slate-300 select-none">|</span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          Đã nhập:{" "}
          <span className="font-semibold text-green-600">{entered}</span>
        </span>
        <span className="text-slate-300 select-none">|</span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
          Chưa nhập:{" "}
          <span className="font-semibold text-slate-500">{notEntered}</span>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80">
              {[
                { label: "STT", cls: "w-12 text-center" },
                { label: "Mã SP", cls: "w-36" },
                { label: "Tên sản phẩm", cls: "min-w-[180px]" },
                { label: "ĐVT", cls: "w-20" },
                { label: "Tồn hệ thống", cls: "w-36 text-right" },
                { label: "Thực đếm", cls: "w-36 text-right" },
                { label: "Chênh lệch", cls: "w-32 text-right" },
                { label: "Ghi chú", cls: "min-w-[160px]" },
              ].map(({ label, cls }) => (
                <th
                  key={label}
                  className={cn(
                    "border-b border-slate-200 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500",
                    cls
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const diff = getDiff(item);
              const isEven = idx % 2 === 0;

              const rowBg =
                diff !== null && diff < 0
                  ? "bg-red-50/60"
                  : diff !== null && diff > 0
                    ? "bg-green-50/60"
                    : isEven
                      ? "bg-white"
                      : "bg-slate-50/30";

              const diffColor =
                diff === null
                  ? ""
                  : diff < 0
                    ? "text-red-500 font-semibold"
                    : diff > 0
                      ? "text-green-600 font-semibold"
                      : "text-slate-400";

              const diffLabel =
                diff === null
                  ? "—"
                  : diff > 0
                    ? `+${formatNum(diff)}`
                    : formatNum(diff);

              return (
                <tr
                  key={item.productId}
                  className={cn("transition-colors hover:brightness-95", rowBg)}
                >
                  {/* STT */}
                  <td className="border-b border-slate-100 px-3 py-2 text-center text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Mã SP */}
                  <td className="border-b border-slate-100 px-3 py-2">
                    <span className="font-mono text-xs text-indigo-600">
                      {item.sku}
                    </span>
                  </td>

                  {/* Tên sản phẩm */}
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                    {item.productName}
                  </td>

                  {/* ĐVT */}
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-500">
                    {item.unit}
                  </td>

                  {/* Tồn hệ thống */}
                  <td className="border-b border-slate-100 px-3 py-2 text-right text-slate-700">
                    {formatNum(item.systemQty)}
                  </td>

                  {/* Thực đếm */}
                  <td className="border-b border-slate-100 px-3 py-2 text-right">
                    {canEdit ? (
                      <input
                        type="number"
                        min={0}
                        value={item.actualQty ?? ""}
                        onChange={(e) =>
                          onQtyChange(item.productId, e.target.value)
                        }
                        placeholder="—"
                        className={cn(
                          "w-24 rounded-lg border border-slate-200 bg-white px-2 py-1",
                          "text-right text-sm text-slate-800 placeholder:text-slate-300",
                          "outline-none transition",
                          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                        )}
                      />
                    ) : (
                      <span className="text-slate-700">
                        {formatNum(item.actualQty)}
                      </span>
                    )}
                  </td>

                  {/* Chênh lệch */}
                  <td
                    className={cn(
                      "border-b border-slate-100 px-3 py-2 text-right",
                      diffColor
                    )}
                  >
                    {diffLabel}
                  </td>

                  {/* Ghi chú */}
                  <td className="border-b border-slate-100 px-3 py-2">
                    {canEdit ? (
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) =>
                          onNoteChange(item.productId, e.target.value)
                        }
                        placeholder="Ghi chú..."
                        className={cn(
                          "w-full rounded-lg border border-slate-200 bg-white px-2 py-1",
                          "text-sm text-slate-700 placeholder:text-slate-300",
                          "outline-none transition",
                          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                        )}
                      />
                    ) : (
                      <span className="text-slate-500">
                        {item.note || "—"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-slate-400"
                >
                  Không có mặt hàng nào trong phiếu kiểm kê.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
