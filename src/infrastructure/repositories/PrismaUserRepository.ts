import type { IUserRepository } from "@/application/ports/IUserRepository";
import type { User } from "@/domain/entities/User";
import type { PrismaClient } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findByUsername(username: string): Promise<User | null> {
    const record = await this.db.user.findUnique({ where: { username } });
    if (!record) return null;
    return {
      id: record.id,
      username: record.username,
      passwordHash: record.passwordHash,
    };
  }
}
