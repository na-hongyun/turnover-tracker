export function getDatabaseConfigError(): string | null {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    return "서버 DB 설정 오류: DATABASE_URL 환경 변수가 없습니다. Vercel → Settings → Environment Variables에 Neon PostgreSQL URL을 추가한 뒤 Redeploy 하세요.";
  }

  if (url.startsWith("file:")) {
    return "서버 DB 설정 오류: DATABASE_URL이 SQLite(file:...)입니다. Neon postgresql:// URL로 교체 후 Redeploy 하세요.";
  }

  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    return "서버 DB 설정 오류: DATABASE_URL은 postgresql:// 로 시작해야 합니다.";
  }

  return null;
}

export function assertDatabaseConfigured(): void {
  const error = getDatabaseConfigError();
  if (error) {
    throw new Error(error);
  }
}
