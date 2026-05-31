import { buildSingleProductMetrics } from "@/domain/services/productMetricsBuilder";
import type { Product } from "@/domain/entities/Product";

function baseProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-1",
    barcode: "8800000000001",
    name: "테스트 상품",
    currentStock: 200,
    shipmentM1: 120,
    shipmentM2: 95,
    shipmentM3: 110,
    seasonalityIndex: 1,
    leadTime: 14,
    unitPrice: 10000,
    ...overrides,
  };
}

describe("productMetricsBuilder", () => {
  it("shows suggested order qty when stock status is danger", () => {
    const product = baseProduct({
      currentStock: 45,
      shipmentM1: 120,
      shipmentM2: 95,
      shipmentM3: 110,
      seasonalityIndex: 1.2,
      leadTime: 14,
    });

    const metrics = buildSingleProductMetrics(product);

    expect(metrics.stockStatus).toBe("danger");
    expect(metrics.suggestedOrderQty).toBeGreaterThan(0);
  });

  it("aligns danger alert with positive suggested qty in gap zone regression case", () => {
    const product = baseProduct({
      currentStock: 200,
      shipmentM1: 60,
      shipmentM2: 60,
      shipmentM3: 60,
      seasonalityIndex: 1,
      leadTime: 14,
    });

    const metrics = buildSingleProductMetrics(product);

    expect(metrics.stockStatus).toBe("danger");
    expect(metrics.turnoverDays).toBeLessThanOrEqual(90 + 14);
    expect(metrics.suggestedOrderQty).toBeGreaterThan(0);
  });
});
