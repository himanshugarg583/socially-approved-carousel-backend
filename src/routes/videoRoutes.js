import { Router } from "express";
import { param, body } from "express-validator";
import { getVideos, getVideo } from "../controllers/videoController.js";
import { likeVideo, shareVideo } from "../controllers/interactionController.js";
import { validate } from "../middleware/validate.js";
import { writeLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const videoIdRule = param("id").isInt({ min: 1 }).withMessage("Video id must be a positive integer");

router.get("/", getVideos);

router.get("/:id", videoIdRule, validate, getVideo);

router.post("/:id/like", writeLimiter, videoIdRule, validate, likeVideo);

router.post(
  "/:id/share",
  writeLimiter,
  videoIdRule,
  body("platform")
    .optional()
    .isString()
    .isIn(["link", "whatsapp", "twitter", "facebook", "instagram", "telegram"])
    .withMessage("Unsupported share platform"),
  validate,
  shareVideo
);

export default router;
