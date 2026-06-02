import express from "express";
import authController from "./auth.controller";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

router.post("/register", rateLimiter, authController.register);
router.post("/login", rateLimiter, authController.login);
router.post("/logout", rateLimiter, authController.logout);
router.post("/refresh", rateLimiter, authController.refresh);

export default router;