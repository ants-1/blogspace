import express from "express";
import reactionController from "./reaction.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router({ mergeParams: true });

router.put(
  "/likes",
  authenticateToken,
  rateLimiter,
  reactionController.toggleLikes,
);
router.put(
  "/dislikes",
  authenticateToken,
  rateLimiter,
  reactionController.toggleDislikes,
);

export default router;
