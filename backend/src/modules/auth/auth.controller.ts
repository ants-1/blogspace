import { Request, Response, NextFunction } from "express";
import authService from "../auth/auth.service";
import { registerUserSchema, loginUserSchema } from "./auth.schema";
import * as z from "zod";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../middleware/auth.middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../users/user.model";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    registerUserSchema.parse(userData);

    const user = await authService.register(req.body);

    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedError = z.prettifyError(error);
      return res.status(400).json({ error: formattedError });
    }

    res.status(500).json({ error: error.message });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    loginUserSchema.parse(userData);

    const user = await authService.login(userData);

    // Generate tokens
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // enable in production (https)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ user, token: accessToken });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedError = z.prettifyError(error);
      return res.status(400).json({ error: formattedError });
    }

    res.status(500).json({ error: error.message });
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No token provided." });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as JwtPayload;

    const user = await UserModel.findById(payload.id);

    if (!user) {
      return res.status(403).json({ error: "Invalid token." });
    }

    const newAccessToken = await generateAccessToken(user);
    res.status(200).json({ token: newAccessToken });
  } catch (error: any) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

export default {
  register,
  login,
  logout,
  refresh,
};
