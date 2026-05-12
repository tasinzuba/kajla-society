import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const IS_SERVERLESS = process.env.VERCEL === "1";

const uploadRoot = path.resolve(env.UPLOAD_DIR);

// Try to create the upload directory only when we have a writable filesystem.
if (!IS_SERVERLESS) {
  try {
    if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
  } catch (err) {
    console.warn("[upload] Cannot create upload directory:", err);
  }
}

const storage = IS_SERVERLESS
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => {
        const today = new Date();
        const sub = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}`;
        const dir = path.join(uploadRoot, sub);
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (err) {
          return cb(err as Error, "");
        }
        cb(null, dir);
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path
          .basename(file.originalname, ext)
          .replace(/[^a-z0-9-]/gi, "-")
          .toLowerCase()
          .slice(0, 40);
        const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        cb(null, `${base || "file"}-${stamp}${ext}`);
      },
    });

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
      return;
    }
    cb(null, true);
  },
});

/**
 * Compute the public-facing URL for an uploaded file.
 * On serverless (Vercel), files only exist in memory and we don't have persistent storage.
 * In that case we throw a clear error so the caller knows to enable Cloudinary.
 */
export function publicUrl(file: Express.Multer.File): string {
  if (IS_SERVERLESS) {
    throw ApiError.internal(
      "File uploads are not configured for serverless deployment. " +
        "Set up Cloudinary integration to enable image uploads."
    );
  }
  const rel = path.relative(uploadRoot, file.path).replace(/\\/g, "/");
  return `/uploads/${rel}`;
}

export const isUploadEnabled = !IS_SERVERLESS;
