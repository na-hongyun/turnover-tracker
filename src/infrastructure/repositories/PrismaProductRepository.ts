import type { Product, ProductInput } from "@/domain/entities/Product";
import type { IProductRepository } from "@/application/ports/IProductRepository";
import type { PrismaClient } from "@prisma/client";
import { toDomain, toPrismaInput } from "@/infrastructure/repositories/productMappers";

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    const records = await this.db.product.findMany({
      orderBy: { name: "asc" },
    });
    return records.map(toDomain);
  }

  async findByBarcode(barcode: string): Promise<Product | undefined> {
    const record = await this.db.product.findUnique({ where: { barcode } });
    return record ? toDomain(record) : undefined;
  }

  async create(input: ProductInput): Promise<Product> {
    const record = await this.db.product.create({ data: toPrismaInput(input) });
    return toDomain(record);
  }

  async update(id: string, input: ProductInput): Promise<Product | null> {
    try {
      const record = await this.db.product.update({
        where: { id },
        data: toPrismaInput(input),
      });
      return toDomain(record);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async search(query: string): Promise<Product[]> {
    const normalized = query.toLowerCase();
    const records = await this.db.product.findMany({
      orderBy: { name: "asc" },
    });
    return records
      .map(toDomain)
      .filter(
        (p) =>
          p.barcode.toLowerCase().includes(normalized) ||
          p.name.toLowerCase().includes(normalized),
      );
  }
}
