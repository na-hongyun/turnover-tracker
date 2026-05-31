import {
  ABC_MIDDLE_PERCENT,
  ABC_TOP_PERCENT,
} from "@/domain/constants/scmConstants";
import type { AbcGrade } from "@/domain/entities/Product";

export function calculateShipmentValue(
  shipmentM1: number,
  shipmentM2: number,
  shipmentM3: number,
  unitPrice: number,
): number {
  return (shipmentM1 + shipmentM2 + shipmentM3) * unitPrice;
}

export interface AbcRankInput {
  id: string;
  shipmentValue: number;
}

/**
 * 3개월 총 출하 금액 기준 내림차순 → A(상위 20%) / B(중간 30%) / C(하위 50%)
 */
export function assignAbcGrades(
  items: AbcRankInput[],
): Map<string, AbcGrade> {
  const sorted = [...items].sort((a, b) => b.shipmentValue - a.shipmentValue);
  const n = sorted.length;
  const grades = new Map<string, AbcGrade>();
  if (n === 0) return grades;

  const aCount = Math.max(1, Math.ceil(n * ABC_TOP_PERCENT));
  const bCount = Math.ceil(n * ABC_MIDDLE_PERCENT);

  sorted.forEach((item, index) => {
    if (index < aCount) grades.set(item.id, "A");
    else if (index < aCount + bCount) grades.set(item.id, "B");
    else grades.set(item.id, "C");
  });

  return grades;
}

const GRADE_ORDER: Record<AbcGrade, number> = { A: 0, B: 1, C: 2 };

/** A등급 최상단, 동일 등급 내 출하 금액 내림차순 */
export function sortForDashboard<T extends { abcGrade: AbcGrade; shipmentValue: number }>(
  products: T[],
): T[] {
  return [...products].sort((a, b) => {
    const gradeDiff = GRADE_ORDER[a.abcGrade] - GRADE_ORDER[b.abcGrade];
    if (gradeDiff !== 0) return gradeDiff;
    return b.shipmentValue - a.shipmentValue;
  });
}
