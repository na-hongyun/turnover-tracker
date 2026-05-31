"use client";

import { useLanguage } from "@/presentation/i18n/LanguageContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full min-w-0 flex-1">
      <label htmlFor="product-search" className="sr-only">
        {t.search.label}
      </label>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
      <input
        id="product-search"
        type="search"
        placeholder={t.search.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-[200px] rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
