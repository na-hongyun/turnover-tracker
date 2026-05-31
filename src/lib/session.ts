import { cookies } from "next/headers";
import { getAuthUseCases } from "@/infrastructure/repositories/getAuthServices";
import { SESSION_COOKIE_NAME } from "@/infrastructure/auth/jwtSessionService";
import type { SessionPayload } from "@/domain/entities/User";

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getAuthUseCases().verifySession(token);
}
