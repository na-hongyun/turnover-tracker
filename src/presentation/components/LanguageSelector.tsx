"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/presentation/i18n/LanguageContext";
import type { Locale } from "@/presentation/i18n/translations";

const LOCALES: Locale[] = ["ko", "ja"];

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <Globe
        className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
        aria-hidden
      />
      <select
        id="language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t.languageSelectorAria}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        {LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {t.localeLabels[loc]}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
