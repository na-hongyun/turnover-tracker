import type { SessionPayload } from "@/domain/entities/User";

export interface ISessionService {
  createToken(payload: SessionPayload): Promise<string>;
  verifyToken(token: string): Promise<SessionPayload | null>;
}
