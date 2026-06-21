import express from "express";
import postController from "./post.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.post("/", rateLimiter, postController.createPost);
router.put("/:id", rateLimiter, postController.updatePost);
router.delete("/:id", rateLimiter, postController.deletePost);

export default router;
