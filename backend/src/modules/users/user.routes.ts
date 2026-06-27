import express from "express";
import userController from "./user.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router();

// User routes

// Public
router.get("/", rateLimiter, userController.getUsers);
router.get("/:id", rateLimiter, userController.getUser);

// Private
router.put("/:id", rateLimiter, authenticateToken, userController.updateUser);
router.put(
  "/:id/password",
  rateLimiter,
  authenticateToken,
  userController.updateUserPassword,
);

// Following/Followers routes
router.get("/:id/followers", rateLimiter, userController.getFollowers);
router.get("/:id/followings", rateLimiter, userController.getFollowings);
router.put(
  "/:id/followings/:followingId",
  rateLimiter,
  userController.toggleFollowing,
);

export default router;
