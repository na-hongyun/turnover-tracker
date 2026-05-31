export type StockStatus = "danger" | "normal" | "warning";
export type AbcGrade = "A" | "B" | "C";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  currentStock: number;
  shipmentM1: number;
  shipmentM2: number;
  shipmentM3: number;
  seasonalityIndex: number;
  leadTime: number;
  unitPrice: number;
}

export interface ProductInput {
  barcode: string;
  name: string;
  currentStock: number;
  shipmentM1: number;
  shipmentM2: number;
  shipmentM3: number;
  seasonalityIndex: number;
  leadTime: number;
  unitPrice: number;
}

export interface ProductWithMetrics extends Product {
  simpleDailyShipment: number;
  adjustedDailyShipment: number;
  turnoverDays: number;
  stockStatus: StockStatus;
  suggestedOrderQty: number;
  shipmentValue: number;
  abcGrade: AbcGrade;
}
