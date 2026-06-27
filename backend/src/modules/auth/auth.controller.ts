import { Request, Response, NextFunction } from "express";
import authService from "../auth/auth.service";
import { registerUserSchema, loginUserSchema } from "./auth.schema";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../middleware/auth.middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../users/user.model";
import { createResponse } from "../../utils/createResponse";
import asyncHandler from "express-async-handler";
import { AppError } from "../../exceptions/AppError";
import { redis } from "../../config/redis";

const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userData = await registerUserSchema.parse(req.body);

    const result = await authService.register(userData);

    res.status(201).json(createResponse(true, result, null));
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userData = loginUserSchema.parse(req.body);

    const result = await authService.login(userData);

    // Generate tokens
    const accessToken = await generateAccessToken(result);
    const refreshToken = await generateRefreshToken(result);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // enable in production (https)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Save refresh token
    await redis.set(`refresh:${result._id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    res
      .status(200)
      .json(createResponse(true, { user: result, token: accessToken }, null));
  },
);

const logout = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    // Blacklist access token
    if (accessToken) {
      const decoded = jwt.decode(accessToken) as JwtPayload;

      if (decoded?.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

        if (expiresIn > 0) {
          await redis.set(`blacklist:${accessToken}`, "true", {
            EX: expiresIn,
          });
        }
      }
    }

    // Remove refresh token from Redis
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken) as JwtPayload;

      if (decoded?.id) {
        await redis.del(`refresh:${decoded.id}`);
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json(createResponse(true, "Logged out successfully", null));
  },
);

const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("No token provided", 401);
    }

    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as JwtPayload;
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    const storedToken = await redis.get(`refresh:${payload.id}`);

    if (!storedToken || storedToken !== refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await UserModel.findById(payload.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate new tokens
    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    // Replace refresh token in Redis
    await redis.set(`refresh:${user._id}`, newRefreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    // Replace refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(createResponse(true, { token: newAccessToken }, null));
  },
);

export default {
  register,
  login,
  logout,
  refresh,
};
