import type { IUserRepository } from "@/application/ports/IUserRepository";
import type { IPasswordHasher } from "@/application/ports/IPasswordHasher";
import type { ISessionService } from "@/application/ports/ISessionService";
import type { SessionPayload } from "@/domain/entities/User";

export class AuthUseCases {
  constructor(
    private readonly users: IUserRepository,
    private readonly passwords: IPasswordHasher,
    private readonly sessions: ISessionService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; payload: SessionPayload }> {
    const normalized = username.trim();
    if (!normalized || !password) {
      throw new Error("아이디와 비밀번호를 입력해 주세요.");
    }

    const user = await this.users.findByUsername(normalized);
    if (!user) {
      throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }

    const valid = await this.passwords.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }

    const payload: SessionPayload = {
      userId: user.id,
      username: user.username,
    };
    const token = await this.sessions.createToken(payload);
    return { token, payload };
  }

  async verifySession(token: string): Promise<SessionPayload | null> {
    return this.sessions.verifyToken(token);
  }
}
