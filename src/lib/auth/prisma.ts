// src/lib/prisma.ts
import "server-only";

import { PrismaClient } from "@/src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}