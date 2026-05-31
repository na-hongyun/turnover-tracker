"use client";

import { useLanguage } from "@/presentation/i18n/LanguageContext";

export function LogisticsMetricsGuide() {
  const { t } = useLanguage();
  const items = [
    t.guide.adjustedDailyShipment,
    t.guide.turnoverDays,
    t.guide.alertThreshold,
    t.guide.suggestedOrderQty,
  ];

  return (
    <section
      className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
      aria-labelledby="metrics-guide-title"
    >
      <h2
        id="metrics-guide-title"
        className="mb-4 text-base font-bold text-slate-800"
      >
        {t.guide.title}
      </h2>
      <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
        {items.map((item) => (
          <li key={item.label}>
            <span className="font-bold text-slate-900">{item.label}</span>{" "}
            {item.formula}
          </li>
        ))}
      </ul>
    </section>
  );
}
