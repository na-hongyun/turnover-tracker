import type { Product } from "@/domain/entities/Product";
import {
  DEFAULT_LEAD_TIME,
  DEFAULT_SEASONALITY_INDEX,
} from "@/domain/constants/scmConstants";

/** 초기 데모용 상품 데이터 */
export function createMockProducts(): Product[] {
  return [
    {
      id: "prod-001",
      barcode: "8801234567890",
      name: "프리미엄 무선 이어폰",
      currentStock: 45,
      shipmentM1: 120,
      shipmentM2: 95,
      shipmentM3: 110,
      seasonalityIndex: 1.2,
      leadTime: 14,
      unitPrice: 89000,
    },
    {
      id: "prod-002",
      barcode: "8801234567891",
      name: "USB-C 고속 충전 케이블",
      currentStock: 320,
      shipmentM1: 40,
      shipmentM2: 35,
      shipmentM3: 38,
      seasonalityIndex: 1.0,
      leadTime: 7,
      unitPrice: 12000,
    },
    {
      id: "prod-003",
      barcode: "8801234567892",
      name: "블루투스 키보드",
      currentStock: 18,
      shipmentM1: 25,
      shipmentM2: 30,
      shipmentM3: 28,
      seasonalityIndex: 1.5,
      leadTime: 21,
      unitPrice: 45000,
    },
    {
      id: "prod-004",
      barcode: "8801234567893",
      name: "노트북 거치대",
      currentStock: 8,
      shipmentM1: 15,
      shipmentM2: 12,
      shipmentM3: 18,
      seasonalityIndex: 0.8,
      leadTime: 14,
      unitPrice: 35000,
    },
    {
      id: "prod-005",
      barcode: "8801234567894",
      name: "무선 마우스",
      currentStock: 200,
      shipmentM1: 10,
      shipmentM2: 8,
      shipmentM3: 12,
      seasonalityIndex: 1.0,
      leadTime: 10,
      unitPrice: 28000,
    },
  ];
}

export function createDefaultProductInput(
  partial?: Partial<import("@/domain/entities/Product").ProductInput>,
): import("@/domain/entities/Product").ProductInput {
  return {
    barcode: "",
    name: "",
    currentStock: 0,
    shipmentM1: 0,
    shipmentM2: 0,
    shipmentM3: 0,
    seasonalityIndex: DEFAULT_SEASONALITY_INDEX,
    leadTime: DEFAULT_LEAD_TIME,
    unitPrice: 0,
    ...partial,
  };
}
