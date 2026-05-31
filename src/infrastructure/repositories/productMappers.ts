import type { Product as PrismaProduct } from "@prisma/client";
import type { Product, ProductInput } from "@/domain/entities/Product";

export function toDomain(record: PrismaProduct): Product {
  return {
    id: record.id,
    barcode: record.barcode,
    name: record.name,
    currentStock: record.currentStock,
    shipmentM1: record.shipmentM1,
    shipmentM2: record.shipmentM2,
    shipmentM3: record.shipmentM3,
    seasonalityIndex: record.seasonalityIndex,
    leadTime: record.leadTime,
    unitPrice: record.unitPrice,
  };
}

export function toPrismaInput(input: ProductInput) {
  return {
    barcode: input.barcode,
    name: input.name,
    currentStock: input.currentStock,
    shipmentM1: input.shipmentM1,
    shipmentM2: input.shipmentM2,
    shipmentM3: input.shipmentM3,
    seasonalityIndex: input.seasonalityIndex,
    leadTime: input.leadTime,
    unitPrice: input.unitPrice,
  };
}
