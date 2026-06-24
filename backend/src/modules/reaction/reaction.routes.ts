import express from "express";
import reactionController from "./reaction.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router({ mergeParams: true });

router.put("/likes", rateLimiter, reactionController.toggleLikes);
router.put("/dislikes", rateLimiter, reactionController.toggleDislikes);

export default router;
