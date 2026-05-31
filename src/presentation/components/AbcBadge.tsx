"use client";

import type { AbcGrade } from "@/domain/entities/Product";
import { useLanguage } from "@/presentation/i18n/LanguageContext";

const GRADE_STYLE: Record<AbcGrade, string> = {
  A: "bg-violet-600 text-white ring-violet-300",
  B: "bg-slate-600 text-white ring-slate-300",
  C: "bg-slate-200 text-slate-700 ring-slate-200",
};

interface AbcBadgeProps {
  grade: AbcGrade;
}

export function AbcBadge({ grade }: AbcBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-2 ${GRADE_STYLE[grade]}`}
      title={t.abc.gradeTitle(grade)}
    >
      {grade}
    </span>
  );
}
