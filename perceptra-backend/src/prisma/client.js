// src/prisma/client.js
import { PrismaClient } from '@prisma/client';
import config from '../config/config.js';

// ---------------------------------------------------------------------------
// Singleton Prisma client — import this everywhere, never instantiate directly.
// In development, reuse the client across hot reloads to avoid connection leaks.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: config.isDev ? ['query', 'warn', 'error'] : ['warn', 'error'],
});

if (config.isDev) {
  globalForPrisma.prisma = prisma;
}

export default prisma;