import { Request, Response, NextFunction } from "express";
import authService from "../auth/auth.service";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.login(req.body);

    if (!user.token) {
      res.status(401).json({ message: "Invalid crendentials" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  register,
  login,
};
