import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config, isProduction } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  const allowedOrigins = config.corsOrigin.split(",").map((v) => v.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow wildcard
        if (allowedOrigins.includes("*")) return callback(null, true);
        // Allow matched origins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      },
      methods: ["GET", "POST"],
      credentials: true
    })
  );
  app.use(express.json({ limit: "16kb" }));
  app.use(morgan(isProduction ? "combined" : "dev"));

  app.get("/health", (req, res) => {
    res.json({ success: true, status: "ok", uptime: process.uptime() });
  });

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
