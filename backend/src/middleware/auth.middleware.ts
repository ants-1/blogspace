import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user: string | JwtPayload | undefined;
}

interface TokenUser {
  _id: Types.ObjectId;
}

export const generateAccessToken = async (user: TokenUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = async (user: TokenUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, (error, user) => {
    if (error) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  });
};
