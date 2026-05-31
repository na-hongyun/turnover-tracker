import { PrismaClient } from "@prisma/client";
import { syncDatabaseUrlEnv } from "@/lib/databaseConfig";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isClientReady(client: PrismaClient): boolean {
  return typeof client.user?.findUnique === "function";
}

/**
 * Hot reload / 스키마 변경 후 예전 PrismaClient가 남으면 user delegate가 없어짐.
 * 유효하지 않으면 싱글톤을 버리고 새 클라이언트를 생성한다.
 */
export function getPrismaClient(): PrismaClient {
  syncDatabaseUrlEnv();

  const cached = globalForPrisma.prisma;
  if (cached && !isClientReady(cached)) {
    void cached.$disconnect();
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}

/** @deprecated Prefer getPrismaClient() — 모듈 로드 시점 캐시 이슈 방지 */
export const prisma = getPrismaClient();
