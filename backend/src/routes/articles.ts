import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  listAdmin,
  getBySlug,
  getAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  upsertArticleSchema,
  listQuerySchema,
} from "../controllers/articleController";

const router = Router();

// ---- Public ----
router.get("/", validate(listQuerySchema, "query"), asyncHandler(listPublic));
router.get("/slug/:slug", asyncHandler(getBySlug));

// ---- Admin ----
router.get("/admin", requireAuth, requireEditor, validate(listQuerySchema, "query"), asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertArticleSchema), asyncHandler(createArticle));
router.put("/:id", requireAuth, requireEditor, validate(upsertArticleSchema), asyncHandler(updateArticle));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteArticle));

export default router;
