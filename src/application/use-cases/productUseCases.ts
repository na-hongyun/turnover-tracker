import type {
  ProductInput,
  ProductWithMetrics,
} from "@/domain/entities/Product";
import { enrichProductsWithMetrics } from "@/domain/services/productMetricsBuilder";
import type { IProductRepository } from "@/application/ports/IProductRepository";

export class ProductUseCases {
  constructor(private readonly repository: IProductRepository) {}

  async listProducts(searchQuery = ""): Promise<ProductWithMetrics[]> {
    const products = searchQuery.trim()
      ? await this.repository.search(searchQuery.trim())
      : await this.repository.findAll();

    return enrichProductsWithMetrics(products);
  }

  async getProduct(id: string): Promise<ProductWithMetrics | null> {
    const products = await this.repository.findAll();
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    const [enriched] = enrichProductsWithMetrics([product]);
    return enriched ?? null;
  }

  async registerProduct(input: ProductInput): Promise<ProductWithMetrics> {
    const existing = await this.repository.findByBarcode(input.barcode);
    if (existing) {
      throw new Error(`바코드 "${input.barcode}"는 이미 등록되어 있습니다.`);
    }

    const created = await this.repository.create(input);
    const enriched = enrichProductsWithMetrics(
      await this.repository.findAll(),
    );
    const found = enriched.find((p) => p.id === created.id);
    if (!found) throw new Error("상품 등록 후 조회에 실패했습니다.");
    return found;
  }

  async updateProduct(
    id: string,
    input: ProductInput,
  ): Promise<ProductWithMetrics> {
    const products = await this.repository.findAll();
    const duplicate = products.find(
      (p) => p.barcode === input.barcode && p.id !== id,
    );
    if (duplicate) {
      throw new Error(`바코드 "${input.barcode}"는 이미 등록되어 있습니다.`);
    }

    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    const enriched = enrichProductsWithMetrics(
      await this.repository.findAll(),
    );
    const found = enriched.find((p) => p.id === id);
    if (!found) throw new Error("상품 수정 후 조회에 실패했습니다.");
    return found;
  }

  async removeProduct(id: string): Promise<void> {
    const removed = await this.repository.delete(id);
    if (!removed) {
      throw new Error("상품을 찾을 수 없습니다.");
    }
  }
}
