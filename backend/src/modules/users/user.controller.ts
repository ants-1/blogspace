import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import {
  toggleFollowingSchema,
  updateUserPasswordSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.schema";
import { FollowingParams, IdParams } from "../../types/types";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../utils/createResponse";

const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await userService.getUsers(page, limit);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getUser = asyncHandler(
  async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    const { id } = await userIdSchema.parse(req.params);

    const result = await userService.getUser(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = await updateUserSchema.parse({
      id: req.params.id,
      ...req.body,
    });

    const result = await userService.updateUser(userData);

    res.status(200).json(createResponse(true, result, null));
  },
);

const updateUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = await updateUserPasswordSchema.parse({
      id: req.params.id,
      ...req.body,
    });

    const result = await userService.updateUserPassword(userData);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getFollowers = asyncHandler(
  async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    const { id } = await userIdSchema.parse(req.params);

    const result = await userService.getFollowers(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getFollowings = asyncHandler(
  async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    const { id } = await userIdSchema.parse(req.params);

    const result = await userService.getFollowings(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

const toggleFollowing = asyncHandler(
  async (req: Request<FollowingParams>, res: Response, next: NextFunction) => {
    const { id, followingId } = toggleFollowingSchema.parse(req.params);

    const result = await userService.toggleFollowing(id, followingId);

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  getUsers,
  getUser,
  updateUser,
  updateUserPassword,
  getFollowers,
  getFollowings,
  toggleFollowing,
};
