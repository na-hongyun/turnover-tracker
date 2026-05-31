import { execSync } from "node:child_process";
import { resolveDatabaseUrl, syncDatabaseUrlEnv } from "../src/lib/databaseConfig";

function run(command: string) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

function isValidPostgresUrl(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("file:")) return false;
  return trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://");
}

function warnMissingDatabase() {
  console.warn(`
⚠️  [Vercel Build] DATABASE_URL이 없거나 올바르지 않습니다.
    → 이번 배포는 Next.js 빌드만 진행합니다 (배포는 성공).
    → 로그인/DB 기능을 쓰려면 Vercel 환경 변수를 설정한 뒤 Redeploy 하세요.

📋 Settings → Environment Variables:

  DATABASE_URL  = Neon postgresql://... URL
  SESSION_SECRET  = 32자 이상 랜덤 문자열

Neon: https://neon.tech → New Project → Connect → Connection string 복사
`);
}

syncDatabaseUrlEnv();
const dbUrl = resolveDatabaseUrl();
const hasDatabase = isValidPostgresUrl(dbUrl);

if (dbUrl?.startsWith("file:")) {
  console.warn(
    "\n⚠️  [Vercel Build] DATABASE_URL이 SQLite(file:...)입니다. PostgreSQL URL로 교체하세요.",
  );
}

try {
  run("npx prisma generate");

  if (hasDatabase) {
    console.log("\n✅ [Vercel Build] DATABASE_URL 확인됨 — DB 동기화 및 seed 진행");
    run("npx prisma db push --skip-generate --accept-data-loss");
    run("npx prisma db seed");
  } else {
    warnMissingDatabase();
  }

  run("npx next build");
  console.log(
    hasDatabase
      ? "\n✅ Build completed successfully (with database setup)."
      : "\n✅ Build completed (without database — set DATABASE_URL and redeploy for login).",
  );
} catch (error) {
  console.error("\n❌ [Vercel Build] 명령 실행 중 오류가 발생했습니다.");
  if (error instanceof Error && "stderr" in error) {
    console.error(String((error as { stderr?: Buffer }).stderr ?? ""));
  }
  if (hasDatabase) {
    console.error(`
💡 db push 실패 시 확인:
  - Neon DB가 생성되어 있는지
  - DATABASE_URL의 비밀번호/호스트가 맞는지
  - Neon 대시보드에서 DB가 suspend 상태가 아닌지
`);
  }
  process.exit(1);
}
