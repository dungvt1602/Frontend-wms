"use client";

import { SUGGESTIONS } from "./lib/api";

interface Props {
  onSelect: (text: string) => void;
  visible: boolean;
}

export default function SuggestedPrompts({ onSelect, visible }: Props) {
  if (!visible) return null;

  return (
    <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
