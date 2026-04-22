import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const storageDriverSchema = z.enum(["local", "s3"]);

const envSchema = z.object({
  PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  ADMIN_EMAIL: z.string().email().default("admin@seijaku.local"),
  ADMIN_PASSWORD: z.string().min(8).default("password123"),
  CORS_ORIGIN: z.string().optional(),
  STORAGE_DRIVER: storageDriverSchema.default("local"),
  LOCAL_UPLOAD_DIR: z.string().default("uploads"),
  PUBLIC_BASE_URL: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
  S3_PUBLIC_URL_BASE: z.string().url().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().optional(),
  NOTIFIER_FROM_EMAIL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export type StorageDriver = z.infer<typeof storageDriverSchema>;
