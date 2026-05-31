export type MonthLocale = "ko" | "ja";

export interface MonthlyShipment {
  monthKey: string;
  quantity: number;
}

const MONTH_LABELS: Record<MonthLocale, readonly string[]> = {
  ko: [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ],
  ja: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
};

export interface MonthSlot {
  monthKey: string;
  label: string;
}

function formatMonthLabel(
  year: number,
  month: number,
  locale: MonthLocale,
): string {
  const monthLabel = MONTH_LABELS[locale][month - 1];
  return locale === "ja"
    ? `${year}年${monthLabel}`
    : `${year}년 ${monthLabel}`;
}

/** 현재 월을 제외한 직전 3개월 슬롯 (예: 5월 기준 → 4월, 3월, 2월) */
export function getLastThreeMonthSlots(
  referenceDate: Date = new Date(),
  locale: MonthLocale = "ko",
): MonthSlot[] {
  const slots: MonthSlot[] = [];

  for (let offset = 1; offset <= 3; offset += 1) {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - offset,
      1,
    );
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    slots.push({
      monthKey,
      label: formatMonthLabel(year, month, locale),
    });
  }

  return slots;
}

export function createEmptyShipmentsForLastThreeMonths(
  referenceDate: Date = new Date(),
): MonthlyShipment[] {
  return getLastThreeMonthSlots(referenceDate).map((slot) => ({
    monthKey: slot.monthKey,
    quantity: 0,
  }));
}
