import dotenv from "dotenv";
dotenv.config();

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",

  DATABASE_URL: required("DATABASE_URL", "postgresql://localhost:5432/kajla_society"),
  DIRECT_URL: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",

  JWT_SECRET: process.env.JWT_SECRET ?? "dev_secret_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",

  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASS: process.env.SMTP_PASS ?? "",
  SMTP_FROM: process.env.SMTP_FROM ?? "Kajla Society <no-reply@kajla.org>",

  UPLOAD_DIR: process.env.UPLOAD_DIR ?? "uploads",
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB ?? 10),
} as const;

export const isProd = env.NODE_ENV === "production";
