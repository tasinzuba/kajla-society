import { Router } from "express";
import { requireAuth, requireStaff } from "../middleware/auth";
import { upload, publicUrl } from "../middleware/upload";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Upload a single file (used by Tiptap inline images, cover images, attachments)
router.post(
  "/",
  requireAuth,
  requireStaff,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest("No file uploaded");
    const url = publicUrl(req.file);
    res.json({
      success: true,
      data: {
        url,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  })
);

// Upload multiple files (gallery, application documents)
router.post(
  "/many",
  requireAuth,
  requireStaff,
  upload.array("files", 20),
  asyncHandler(async (req, res) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (!files.length) throw ApiError.badRequest("No files uploaded");
    res.json({
      success: true,
      data: files.map((f) => ({
        url: publicUrl(f),
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
      })),
    });
  })
);

export default router;
