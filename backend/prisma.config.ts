import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the direct (non-pooled) Neon URL for migrations.
    // Falls back to DATABASE_URL if DIRECT_URL is not set.
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});
