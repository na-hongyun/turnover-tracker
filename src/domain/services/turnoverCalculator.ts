import {
  DAYS_PER_MONTH,
  INFINITE_TURNOVER_DAYS,
  MONTHS_FOR_AVERAGE,
} from "@/domain/constants/scmConstants";

/**
 * 단순 평균 일일 출하량 = (M1 + M2 + M3) / 3 / 30
 */
export function calculateSimpleDailyShipment(
  shipmentM1: number,
  shipmentM2: number,
  shipmentM3: number,
): number {
  const total = shipmentM1 + shipmentM2 + shipmentM3;
  return total / MONTHS_FOR_AVERAGE / DAYS_PER_MONTH;
}

/**
 * 보정된 일일 출하량 = 단순 평균 일일 출하량 × seasonalityIndex
 */
export function calculateAdjustedDailyShipment(
  simpleDailyShipment: number,
  seasonalityIndex: number,
): number {
  return simpleDailyShipment * seasonalityIndex;
}

/**
 * 재고 회전율(소진 일수) = currentStock / 보정된 일일 출하량
 * 보정 일일 출하량이 0이면 999일
 */
export function calculateTurnoverDays(
  currentStock: number,
  adjustedDailyShipment: number,
): number {
  if (adjustedDailyShipment <= 0) {
    return INFINITE_TURNOVER_DAYS;
  }
  return currentStock / adjustedDailyShipment;
}
