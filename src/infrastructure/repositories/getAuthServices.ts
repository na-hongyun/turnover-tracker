import { AuthUseCases } from "@/application/use-cases/authUseCases";
import { BcryptPasswordHasher } from "@/infrastructure/auth/bcryptPasswordHasher";
import {
  JwtSessionService,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/infrastructure/auth/jwtSessionService";
import { getPrismaClient } from "@/infrastructure/db/prisma";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";

let authUseCases: AuthUseCases | null = null;
let boundClient: ReturnType<typeof getPrismaClient> | null = null;

export function getAuthUseCases(): AuthUseCases {
  const client = getPrismaClient();
  if (!authUseCases || boundClient !== client) {
    authUseCases = new AuthUseCases(
      new PrismaUserRepository(client),
      new BcryptPasswordHasher(),
      new JwtSessionService(),
    );
    boundClient = client;
  }
  return authUseCases;
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE };
