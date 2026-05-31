import type { Product, ProductInput } from "@/domain/entities/Product";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findByBarcode(barcode: string): Promise<Product | undefined>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Product[]>;
}
