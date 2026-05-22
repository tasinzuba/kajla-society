import { Router } from "express";
import authRouter from "./auth";
import articlesRouter from "./articles";
import categoriesRouter from "./categories";
import eventsRouter from "./events";
import noticesRouter from "./notices";
import applicationsRouter from "./applications";
import pagesRouter from "./pages";
import contactRouter from "./contact";
import statsRouter from "./stats";
import facilitiesRouter from "./facilities";
import galleriesRouter from "./galleries";
import committeeRouter from "./committee";
import residentsRouter from "./residents";
import uploadsRouter from "./uploads";
import heroSlidesRouter from "./heroSlides";
import testimonialsRouter from "./testimonials";
import settingsRouter from "./settings";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Kajla Society API is running", uptime: process.uptime() });
});

router.use("/auth", authRouter);
router.use("/articles", articlesRouter);
router.use("/categories", categoriesRouter);
router.use("/events", eventsRouter);
router.use("/notices", noticesRouter);
router.use("/applications", applicationsRouter);
router.use("/pages", pagesRouter);
router.use("/contact", contactRouter);
router.use("/stats", statsRouter);
router.use("/facilities", facilitiesRouter);
router.use("/galleries", galleriesRouter);
router.use("/committee", committeeRouter);
router.use("/residents", residentsRouter);
router.use("/uploads", uploadsRouter);
router.use("/hero-slides", heroSlidesRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/settings", settingsRouter);

export default router;
