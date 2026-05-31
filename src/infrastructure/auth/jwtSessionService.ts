import { SignJWT, jwtVerify } from "jose";
import type { ISessionService } from "@/application/ports/ISessionService";
import type { SessionPayload } from "@/domain/entities/User";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7일

function getSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ?? "dev-scm-session-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export class JwtSessionService implements ISessionService {
  async createToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
      .sign(getSecret());
  }

  async verifyToken(token: string): Promise<SessionPayload | null> {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      if (
        typeof payload.userId !== "string" ||
        typeof payload.username !== "string"
      ) {
        return null;
      }
      return {
        userId: payload.userId,
        username: payload.username,
      };
    } catch {
      return null;
    }
  }
}

export const SESSION_COOKIE_NAME = "scm_session";
export const SESSION_MAX_AGE = SESSION_MAX_AGE_SEC;
