import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";

import { env, isProd } from "./config/env";
import apiRouter from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(isProd ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
