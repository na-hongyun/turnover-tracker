import { execSync } from "node:child_process";

/** postinstall / prisma generate — DB 연결 없이 client만 생성 */
const PLACEHOLDER_DB =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = PLACEHOLDER_DB;
}

execSync("npx prisma generate", { stdio: "inherit", env: process.env });
