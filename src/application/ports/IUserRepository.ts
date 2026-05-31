import type { User } from "@/domain/entities/User";

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
}
