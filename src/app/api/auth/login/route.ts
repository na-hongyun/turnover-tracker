import { NextRequest, NextResponse } from "next/server";
import {
  getAuthUseCases,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/infrastructure/repositories/getAuthServices";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  try {
    const { token, payload } = await getAuthUseCases().login(
      body.username ?? "",
      body.password ?? "",
    );

    const response = NextResponse.json({
      username: payload.username,
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "로그인에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
