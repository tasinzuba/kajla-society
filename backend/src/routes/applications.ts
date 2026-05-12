import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  submitMembership,
  listMembership,
  getMembership,
  updateMembershipStatus,
  deleteMembership,
  membershipSchema,
  submitCarSticker,
  listCarSticker,
  getCarSticker,
  updateCarStickerStatus,
  deleteCarSticker,
  carStickerSchema,
  submitAdoption,
  listAdoption,
  getAdoption,
  updateAdoptionStatus,
  deleteAdoption,
  adoptionSchema,
  statusUpdateSchema,
  baseListSchema,
  adoptionListSchema,
} from "../controllers/applicationsController";

const router = Router();

// Public submissions are rate-limited to prevent spam (3 per IP per hour)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions — please try again later" },
});

// ---- Membership ----
router.post("/membership", submitLimiter, validate(membershipSchema), asyncHandler(submitMembership));
router.get("/membership", requireAuth, requireAdmin, validate(baseListSchema, "query"), asyncHandler(listMembership));
router.get("/membership/:id", requireAuth, requireAdmin, asyncHandler(getMembership));
router.patch("/membership/:id/status", requireAuth, requireAdmin, validate(statusUpdateSchema), asyncHandler(updateMembershipStatus));
router.delete("/membership/:id", requireAuth, requireAdmin, asyncHandler(deleteMembership));

// ---- Car Sticker ----
router.post("/car-sticker", submitLimiter, validate(carStickerSchema), asyncHandler(submitCarSticker));
router.get("/car-sticker", requireAuth, requireAdmin, validate(baseListSchema, "query"), asyncHandler(listCarSticker));
router.get("/car-sticker/:id", requireAuth, requireAdmin, asyncHandler(getCarSticker));
router.patch("/car-sticker/:id/status", requireAuth, requireAdmin, validate(statusUpdateSchema), asyncHandler(updateCarStickerStatus));
router.delete("/car-sticker/:id", requireAuth, requireAdmin, asyncHandler(deleteCarSticker));

// ---- Adoption (Road / Gate) ----
router.post("/adoption", submitLimiter, validate(adoptionSchema), asyncHandler(submitAdoption));
router.get("/adoption", requireAuth, requireAdmin, validate(adoptionListSchema, "query"), asyncHandler(listAdoption));
router.get("/adoption/:id", requireAuth, requireAdmin, asyncHandler(getAdoption));
router.patch("/adoption/:id/status", requireAuth, requireAdmin, validate(statusUpdateSchema), asyncHandler(updateAdoptionStatus));
router.delete("/adoption/:id", requireAuth, requireAdmin, asyncHandler(deleteAdoption));

export default router;
