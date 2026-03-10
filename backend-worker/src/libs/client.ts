import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  pool: pg.Pool;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  // Use smaller pool size for serverless/production to avoid exhausting connections
  // Supabase recommends 1-2 connections per serverless function instance
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2, // Reduced from 5 for serverless environments
    min: 0, // Allow pool to scale down to 0
    idleTimeoutMillis: 60_000, // Close idle connections after 60s
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true, // Allow process to exit when pool is idle
  });

  pool.on("error", (err) => {
    console.error("Unexpected idle client error", err);
  });

  pool.on("connect", () => {
    console.log("Database connection established");
  });

  pool.on("remove", () => {
    console.log("Database connection removed from pool");
  });

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  // Store pool reference for cleanup
  globalForPrisma.pool = pool;

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;

// Graceful shutdown - cleanup connections
async function cleanup() {
  console.log("Cleaning up database connections...");
  try {
    await prisma.$disconnect();
    if (globalForPrisma.pool) {
      await globalForPrisma.pool.end();
    }
    console.log("Database connections closed successfully");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Handle graceful shutdown signals
process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("beforeExit", cleanup);
