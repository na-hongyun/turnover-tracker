import { execSync } from "node:child_process";

function run(command: string) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

function fail(message: string, detail?: string) {
  console.error(`\n❌ [Vercel Build] ${message}`);
  if (detail) console.error(detail);
  console.error(`
📋 Vercel 환경 변수 설정 (Settings → Environment Variables):

  DATABASE_URL = Neon PostgreSQL 연결 문자열
    ✅ postgresql:// 로 시작해야 합니다
    ❌ file:./dev.db (SQLite) 는 사용 불가

  SESSION_SECRET = 32자 이상 랜덤 문자열

Neon (https://neon.tech) → 프로젝트 → Connect →
  "Direct connection" 또는 "Pooled connection" URL 복사

환경 변수 저장 후 Redeploy 하세요.
`);
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL?.trim();

if (!dbUrl) {
  fail("DATABASE_URL이 설정되지 않았습니다.");
}

if (dbUrl.startsWith("file:")) {
  fail(
    "DATABASE_URL이 SQLite(file:...)로 설정되어 있습니다.",
    "Vercel에서는 PostgreSQL(Neon) URL이 필요합니다. 기존 file:./dev.db 값을 삭제하고 Neon URL로 교체하세요.",
  );
}

if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
  fail(
    "DATABASE_URL 형식이 올바르지 않습니다.",
    `현재 값은 postgresql:// 로 시작해야 합니다.`,
  );
}

try {
  run("npx prisma generate");
  run("npx prisma db push --skip-generate --accept-data-loss");
  run("npx prisma db seed");
  run("npx next build");
  console.log("\n✅ Build completed successfully.");
} catch (error) {
  console.error("\n❌ [Vercel Build] 명령 실행 중 오류가 발생했습니다.");
  if (error instanceof Error && "stderr" in error) {
    console.error(String((error as { stderr?: Buffer }).stderr ?? ""));
  }
  console.error(`
💡 db push 실패 시 확인:
  - Neon DB가 생성되어 있는지
  - DATABASE_URL의 비밀번호/호스트가 맞는지
  - Neon 대시보드에서 DB가 일시 중지(suspend)되지 않았는지
`);
  process.exit(1);
}
