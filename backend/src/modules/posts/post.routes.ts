import express from "express";
import postController from "./post.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";
import { authenticateToken } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = express.Router();

// Public
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);

// Protected
router.post(
  "/",
  rateLimiter,
  authenticateToken,
  upload.single("featureImg"),
  postController.createPost,
);
router.put("/:id", rateLimiter, authenticateToken, postController.updatePost);
router.delete(
  "/:id",
  rateLimiter,
  authenticateToken,
  postController.deletePost,
);

export default router;
