import { AuthUseCases } from "@/application/use-cases/authUseCases";
import type { IUserRepository } from "@/application/ports/IUserRepository";
import type { IPasswordHasher } from "@/application/ports/IPasswordHasher";
import type { ISessionService } from "@/application/ports/ISessionService";

class MockUserRepo implements IUserRepository {
  constructor(private readonly user: { id: string; username: string; passwordHash: string } | null) {}
  async findByUsername(username: string) {
    if (!this.user || this.user.username !== username) return null;
    return this.user;
  }
}

class MockHasher implements IPasswordHasher {
  async hash(plain: string) {
    return `hashed:${plain}`;
  }
  async compare(plain: string, hash: string) {
    return hash === `hashed:${plain}`;
  }
}

class MockSession implements ISessionService {
  async createToken(payload: { userId: string; username: string }) {
    return `token-${payload.username}`;
  }
  async verifyToken(token: string) {
    if (!token.startsWith("token-")) return null;
    return { userId: "u1", username: token.replace("token-", "") };
  }
}

describe("AuthUseCases", () => {
  const validUser = {
    id: "u1",
    username: "admin",
    passwordHash: "hashed:1234qwer",
  };

  it("logs in with valid credentials", async () => {
    const auth = new AuthUseCases(
      new MockUserRepo(validUser),
      new MockHasher(),
      new MockSession(),
    );
    const result = await auth.login("admin", "1234qwer");
    expect(result.token).toBe("token-admin");
    expect(result.payload.username).toBe("admin");
  });

  it("rejects wrong password", async () => {
    const auth = new AuthUseCases(
      new MockUserRepo(validUser),
      new MockHasher(),
      new MockSession(),
    );
    await expect(auth.login("admin", "wrong")).rejects.toThrow(
      "아이디 또는 비밀번호가 일치하지 않습니다.",
    );
  });

  it("rejects unknown user", async () => {
    const auth = new AuthUseCases(
      new MockUserRepo(null),
      new MockHasher(),
      new MockSession(),
    );
    await expect(auth.login("nobody", "1234qwer")).rejects.toThrow(
      "아이디 또는 비밀번호가 일치하지 않습니다.",
    );
  });

  it("rejects empty credentials", async () => {
    const auth = new AuthUseCases(
      new MockUserRepo(validUser),
      new MockHasher(),
      new MockSession(),
    );
    await expect(auth.login("", "")).rejects.toThrow(
      "아이디와 비밀번호를 입력해 주세요.",
    );
  });
});
