import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env, isProd } from "../config/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProd ? ["error"] : ["warn", "error"],
  });

if (!isProd) globalForPrisma.prisma = prisma;
