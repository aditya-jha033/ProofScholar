import { PrismaClient } from '@prisma/client';
import { Redis } from '@upstash/redis';

// Prisma Client for Neon DB
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Upstash Redis Client
// In development, if env vars are missing, we mock it or allow it to fail gracefully
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://mock-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token',
});
