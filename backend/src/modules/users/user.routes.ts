import express from "express";
import userController from "./user.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

// User routes
router.get("/:id", rateLimiter, userController.getUser);
router.put("/:id", rateLimiter, userController.updateUser);
router.put("/:id/password", rateLimiter, userController.updateUserPassword);

// Following/Followers routes
router.get("/:id/followers", rateLimiter, userController.getFollowers);
router.get("/:id/followings", rateLimiter, userController.getFollowings);
router.put(
  "/:id/followings/:followingId",
  rateLimiter,
  userController.toggleFollowing,
);

export default router;
