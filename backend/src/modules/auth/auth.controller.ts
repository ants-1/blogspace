import { Request, Response, NextFunction } from "express";
import authService from "../auth/auth.service";
import { registerUserSchema, loginUserSchema } from "./auth.schema";
import * as z from "zod";

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

    const user = await authService.login(req.body);

    if (!user.token) {
      res.status(401).json({ message: "Invalid crendentials" });
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedError = z.prettifyError(error);
      return res.status(400).json({ error: formattedError });
    }

    res.status(500).json({ error: error.message });
  }
};

export default {
  register,
  login,
};
