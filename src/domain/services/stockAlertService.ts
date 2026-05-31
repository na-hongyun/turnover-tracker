import {
  BASE_REORDER_DAYS,
  EXCESS_STOCK_DAYS,
} from "@/domain/constants/scmConstants";
import type { StockStatus } from "@/domain/entities/Product";

/**
 * 3단계 재고 경보 (리드타임 반영)
 * - danger: 회전율 ≤ 90 + leadTime
 * - normal: (90 + leadTime) < 회전율 ≤ 180
 * - warning: 회전율 > 180
 */
export function getStockStatus(
  turnoverDays: number,
  leadTime: number,
): StockStatus {
  const dangerThreshold = BASE_REORDER_DAYS + leadTime;
  if (turnoverDays <= dangerThreshold) return "danger";
  if (turnoverDays <= EXCESS_STOCK_DAYS) return "normal";
  return "warning";
}

/**
 * 추천 발주 수량 (발주 필요일 때만)
 * 목표 재고 일수 = 90 + leadTime (발주 경보 기준과 동일 — 경보·수량 불일치 방지)
 * = max(0, ceil(보정 일일 출하량 × 목표 일수 - 현재 재고))
 */
export function calculateSuggestedOrderQty(
  adjustedDailyShipment: number,
  currentStock: number,
  stockStatus: StockStatus,
  leadTime: number,
): number {
  if (stockStatus !== "danger") return 0;
  if (adjustedDailyShipment <= 0) return 0;

  const targetDays = BASE_REORDER_DAYS + leadTime;
  const targetStock = adjustedDailyShipment * targetDays;
  return Math.max(0, Math.ceil(targetStock - currentStock));
}

export function getDangerThresholdDays(leadTime: number): number {
  return BASE_REORDER_DAYS + leadTime;
}

/** 발주 필요이면서 일일 출하가 있을 때 추천 수량이 0인지 (경계값 등) */
export function isDangerWithoutSuggestedQty(
  turnoverDays: number,
  leadTime: number,
  adjustedDailyShipment: number,
  currentStock: number,
): boolean {
  const status = getStockStatus(turnoverDays, leadTime);
  if (status !== "danger") return false;
  return (
    calculateSuggestedOrderQty(
      adjustedDailyShipment,
      currentStock,
      status,
      leadTime,
    ) === 0
  );
}
