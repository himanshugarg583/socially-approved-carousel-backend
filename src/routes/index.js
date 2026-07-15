import { Router } from "express";
import videoRoutes from "./videoRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, status: "ok", uptime: process.uptime() });
});

router.use("/videos", videoRoutes);

export default router;
