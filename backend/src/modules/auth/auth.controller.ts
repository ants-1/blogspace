import { Request, Response, NextFunction } from "express";
import authService from "../auth/auth.service";
import { registerUserSchema, loginUserSchema } from "./auth.schema";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../middleware/auth.middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../users/user.model";
import { createReponse } from "../../utils/createReponse";
import asyncHandler from "express-async-handler";
import { AppError } from "../../exceptions/AppError";

const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userData = await registerUserSchema.parse(req.body);

    const result = await authService.register(userData);

    res.status(201).json(createReponse(true, result, null));
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

    res
      .status(200)
      .json(createReponse(true, { user: result, token: accessToken }, null));
  },
);

const logout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json(createReponse(true, "Logged out successfully", null));
  },
);

const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("No token provided", 401);
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as JwtPayload;

    const user = await UserModel.findById(payload.id);

    if (!user) {
      throw new AppError("Invalid token", 403);
    }

    const newAccessToken = await generateAccessToken(user);

    res.status(200).json(createReponse(true, { token: newAccessToken }, null));
  },
);

export default {
  register,
  login,
  logout,
  refresh,
};
