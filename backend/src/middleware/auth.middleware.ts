import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user: string | JwtPayload | undefined,
}

export const generateToken = async (_id: string) => {
  return jwt.sign({ id: _id }, process.env.JWT_SECRET as string, {
    expiresIn: "15m"
  });
};

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (error, user) => {
    if (error) {
      return res.status(403).json({ error: "Unauthorized"});
    }

    req.user = user;
    next();
  })
};
