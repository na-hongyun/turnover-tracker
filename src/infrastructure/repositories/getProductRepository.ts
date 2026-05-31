import type { IProductRepository } from "@/application/ports/IProductRepository";
import { getPrismaClient } from "@/infrastructure/db/prisma";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";

let repositoryInstance: IProductRepository | null = null;
let boundClient: ReturnType<typeof getPrismaClient> | null = null;

/** 서버(API)에서 사용하는 Prisma 기반 저장소 */
export function getProductRepository(): IProductRepository {
  const client = getPrismaClient();
  if (!repositoryInstance || boundClient !== client) {
    repositoryInstance = new PrismaProductRepository(client);
    boundClient = client;
  }
  return repositoryInstance;
}

export function resetProductRepository(instance?: IProductRepository): void {
  repositoryInstance = instance ?? null;
  boundClient = null;
}
