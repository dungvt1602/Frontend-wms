import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Tất cả", "Điện tử", "Phụ kiện", "Linh kiện"];

interface Props {
  search: string;
  category: string;
  statusF: string;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onStatus: (v: string) => void;
}

export default function ProductFilters({ search, category, statusF, onSearch, onCategory, onStatus }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm mã SP, tên sản phẩm..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                category === c ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <select
            value={statusF}
            onChange={(e) => onStatus(e.target.value)}
            className="h-9 pl-8 pr-6 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-600 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang kinh doanh</option>
            <option value="inactive">Ngừng kinh doanh</option>
          </select>
        </div>

      </div>
    </div>
  );
}
