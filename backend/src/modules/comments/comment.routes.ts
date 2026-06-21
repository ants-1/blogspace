import express from "express";
import commentController from "./comment.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router({ mergeParams: true });

router.post("/", rateLimiter, commentController.createComment);
router.put("/:commentId", rateLimiter, commentController.updateComment);
router.delete("/:commentId", rateLimiter, commentController.deleteComment);

export default router;
