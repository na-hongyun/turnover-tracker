import type { Product, ProductInput } from "@/domain/entities/Product";
import type { IProductRepository } from "@/application/ports/IProductRepository";
import { createMockProducts } from "@/infrastructure/data/mockProductFactory";

function generateId(): string {
  return `prod-${crypto.randomUUID().slice(0, 8)}`;
}

/** 테스트용 인메모리 구현 */
export class InMemoryProductRepository implements IProductRepository {
  private products: Product[];

  constructor(initialProducts?: Product[]) {
    this.products = initialProducts ?? createMockProducts();
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findByBarcode(barcode: string): Promise<Product | undefined> {
    return this.products.find((p) => p.barcode === barcode);
  }

  async create(input: ProductInput): Promise<Product> {
    const product: Product = { id: generateId(), ...input };
    this.products = [...this.products, product];
    return product;
  }

  async update(id: string, input: ProductInput): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Product = { id, ...input };
    const next = [...this.products];
    next[index] = updated;
    this.products = next;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const before = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < before;
  }

  async search(query: string): Promise<Product[]> {
    const normalized = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.barcode.toLowerCase().includes(normalized) ||
        p.name.toLowerCase().includes(normalized),
    );
  }
}
