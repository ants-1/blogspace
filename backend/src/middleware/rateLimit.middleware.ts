import { NextFunction, Request, Response } from "express";
import { redis } from "../config/redis";

const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
const MAX_REQUESTS = 10;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const key = `rate:${req.ip}`;

    const currRequests = await redis.incr(key);

    if (currRequests === 1) {
      await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    if (currRequests > MAX_REQUESTS) {
      return res
        .status(429)
        .json({ error: "Too many request. Please try again later." });
    }
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};
