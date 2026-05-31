import type { Product, ProductWithMetrics } from "@/domain/entities/Product";
import { assignAbcGrades, calculateShipmentValue, sortForDashboard } from "@/domain/services/abcAnalysisService";
import {
  calculateAdjustedDailyShipment,
  calculateSimpleDailyShipment,
  calculateTurnoverDays,
} from "@/domain/services/turnoverCalculator";
import {
  calculateSuggestedOrderQty,
  getStockStatus,
} from "@/domain/services/stockAlertService";

export function buildSingleProductMetrics(
  product: Product,
  abcGrade: ProductWithMetrics["abcGrade"] = "C",
): ProductWithMetrics {
  const simpleDailyShipment = calculateSimpleDailyShipment(
    product.shipmentM1,
    product.shipmentM2,
    product.shipmentM3,
  );
  const adjustedDailyShipment = calculateAdjustedDailyShipment(
    simpleDailyShipment,
    product.seasonalityIndex,
  );
  const turnoverDays = calculateTurnoverDays(
    product.currentStock,
    adjustedDailyShipment,
  );
  const stockStatus = getStockStatus(turnoverDays, product.leadTime);
  const suggestedOrderQty = calculateSuggestedOrderQty(
    adjustedDailyShipment,
    product.currentStock,
    stockStatus,
    product.leadTime,
  );
  const shipmentValue = calculateShipmentValue(
    product.shipmentM1,
    product.shipmentM2,
    product.shipmentM3,
    product.unitPrice,
  );

  return {
    ...product,
    simpleDailyShipment,
    adjustedDailyShipment,
    turnoverDays,
    stockStatus,
    suggestedOrderQty,
    shipmentValue,
    abcGrade,
  };
}

export function enrichProductsWithMetrics(products: Product[]): ProductWithMetrics[] {
  const base = products.map((p) => {
    const shipmentValue = calculateShipmentValue(
      p.shipmentM1,
      p.shipmentM2,
      p.shipmentM3,
      p.unitPrice,
    );
    return { product: p, shipmentValue };
  });

  const gradeMap = assignAbcGrades(
    base.map(({ product, shipmentValue }) => ({
      id: product.id,
      shipmentValue,
    })),
  );

  const withMetrics = base.map(({ product }) =>
    buildSingleProductMetrics(product, gradeMap.get(product.id) ?? "C"),
  );

  return sortForDashboard(withMetrics);
}
