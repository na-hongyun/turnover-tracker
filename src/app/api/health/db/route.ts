import { NextResponse } from "next/server";
import {
  getDatabaseConfigError,
  getDatabaseEnvStatus,
  resolveDatabaseUrl,
} from "@/lib/databaseConfig";

/** 배포 후 DB 환경 변수 인식 여부 확인 (값은 노출하지 않음) */
export async function GET() {
  const error = getDatabaseConfigError();

  return NextResponse.json({
    ok: error === null,
    message: error,
    env: getDatabaseEnvStatus(),
    resolved: Boolean(resolveDatabaseUrl()),
  });
}
