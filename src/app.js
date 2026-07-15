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
  app.use(
    cors({
      origin: config.corsOrigin.split(",").map((value) => value.trim()),
      methods: ["GET", "POST"]
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
