"use client";

import type { StockStatus } from "@/domain/entities/Product";
import { LogisticsTermTooltip } from "@/presentation/components/LogisticsTermTooltip";
import { useLanguage } from "@/presentation/i18n/LanguageContext";

const STATUS_EMOJI: Record<StockStatus, string> = {
  danger: "🔴",
  normal: "🟢",
  warning: "⚠️",
};

const STATUS_CLASS: Record<StockStatus, string> = {
  danger: "bg-red-100 text-red-800 border-red-200",
  normal: "bg-emerald-100 text-emerald-800 border-emerald-200",
  warning: "bg-amber-100 text-amber-900 border-amber-200",
};

interface StockStatusBadgeProps {
  status: StockStatus;
  suggestedOrderQty?: number;
}

export function StockStatusBadge({
  status,
  suggestedOrderQty = 0,
}: StockStatusBadgeProps) {
  const { t } = useLanguage();
  const label = t.status[status];
  const orderTip = t.tooltips.suggestedOrderQty;

  return (
    <div className="inline-flex min-w-max flex-col items-center gap-1.5 whitespace-nowrap">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
      >
        <span aria-hidden>{STATUS_EMOJI[status]}</span>
        {label}
      </span>
      {status === "danger" && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
          <span>{t.status.suggestedOrderLine(suggestedOrderQty)}</span>
          <LogisticsTermTooltip
            title={orderTip.title}
            description={orderTip.description}
            iconOnly
            ariaLabel={t.tooltipAria(orderTip.title)}
          />
        </span>
      )}
    </div>
  );
}
