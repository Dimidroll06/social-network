import { PrismaClient } from "../generated/prisma-client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Single PrismaClient per process to avoid leaking the connection pool during
 * dev hot reload. SQL queries and errors are logged for debugging.
 */
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query", "error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
