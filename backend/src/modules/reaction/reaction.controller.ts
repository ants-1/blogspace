import { Request, Response, NextFunction } from "express";
import reactionService from "./reaction.service";
import { reactionIdSchema } from "./reaction.schema";
import { createResponse } from "../../utils/createResponse";
import asyncHandler from "express-async-handler";

const toggleLikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const likesData = await reactionIdSchema.parse({
      postId: req.params.postId,
      userId: req.body.userId,
    });

    const result = await reactionService.toggleLikes(likesData);

    res.status(200).json(createResponse(true, result, null));
  },
);

const toggleDislikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dislikesData = await reactionIdSchema.parse({
      postId: req.params.postId,
      userId: req.body.userId,
    });

    const result = await reactionService.toggleDislikes(dislikesData);

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  toggleLikes,
  toggleDislikes,
};
