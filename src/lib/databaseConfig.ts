const DATABASE_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

/** Vercel Postgres / Neon 등에서 사용하는 DB URL 후보를 순서대로 탐색 */
export function resolveDatabaseUrl(): string | undefined {
  for (const key of DATABASE_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

/** Prisma schema가 env("DATABASE_URL")만 참조하므로 런타임에 동기화 */
export function syncDatabaseUrlEnv(): void {
  const resolved = resolveDatabaseUrl();
  if (resolved) {
    process.env.DATABASE_URL = resolved;
  }
}

export function getDatabaseEnvStatus(): Record<string, boolean> {
  return Object.fromEntries(
    DATABASE_ENV_KEYS.map((key) => [key, Boolean(process.env[key]?.trim())]),
  );
}

export function getDatabaseConfigError(): string | null {
  syncDatabaseUrlEnv();
  const url = resolveDatabaseUrl();

  if (!url) {
    const status = getDatabaseEnvStatus();
    const checked = Object.entries(status)
      .map(([key, set]) => `${key}=${set ? "설정됨" : "없음"}`)
      .join(", ");

    return (
      "서버 DB 설정 오류: DATABASE_URL 환경 변수가 런타임에 없습니다. " +
      "Vercel → Settings → Environment Variables에 Neon postgresql:// URL을 추가한 뒤 " +
      "**Redeploy(재배포)** 하세요. " +
      `(현재 서버에서 확인: ${checked})`
    );
  }

  if (url.startsWith("file:")) {
    return "서버 DB 설정 오류: DATABASE_URL이 SQLite(file:...)입니다. Neon postgresql:// URL로 교체 후 Redeploy 하세요.";
  }

  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    return "서버 DB 설정 오류: DB URL은 postgresql:// 로 시작해야 합니다.";
  }

  return null;
}

export function assertDatabaseConfigured(): void {
  const error = getDatabaseConfigError();
  if (error) {
    throw new Error(error);
  }
}
