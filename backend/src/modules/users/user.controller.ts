import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import * as z from "zod";
import {
  toggleFollowingSchema,
  updateUserPasswordSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.schema";
import { FollowingParams, IdParams } from "../../types/types";

const getUser = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await userIdSchema.parse({ id });

    const user = await userService.getUser(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { username, email, bio, avatar } = req.body;
    const userData = {
      id,
      username,
      email,
      bio,
      avatar,
    };
    await updateUserSchema.parse(userData);

    const updatedUser = await userService.updateUser(userData);
    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const userData = {
      id,
      currentPassword,
      newPassword,
    };
    await updateUserPasswordSchema.parse(userData);

    const user = await userService.updateUserPassword(userData);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const getFollowers = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await userIdSchema.parse({ id });

    const userFollowers = await userService.getFollowers(id);

    if (!userFollowers) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ followers: userFollowers });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const getFollowings = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await userIdSchema.parse({ id });

    const userFollowings = await userService.getFollowings(id);

    if (!userFollowings) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ followings: userFollowings });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const toggleFollowing = async (
  req: Request<FollowingParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, followingId } = req.params;
    await toggleFollowingSchema.parse({ id, followingId });

    const toggleFollowing = await userService.toggleFollowing(id, followingId);

    if (!toggleFollowing) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(toggleFollowing);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

export default {
  getUser,
  updateUser,
  updateUserPassword,
  getFollowers,
  getFollowings,
  toggleFollowing,
};
