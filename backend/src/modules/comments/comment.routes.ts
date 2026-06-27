import express from "express";
import commentController from "./comment.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  rateLimiter,
  authenticateToken,
  commentController.createComment,
);
router.put(
  "/:commentId",
  rateLimiter,
  authenticateToken,
  commentController.updateComment,
);
router.delete(
  "/:commentId",
  rateLimiter,
  authenticateToken,
  commentController.deleteComment,
);

export default router;
