import { Request, Response, NextFunction } from "express";
import reactionService from "./reaction.service";
import * as z from "zod";
import { reactionIdSchema } from "./reaction.schema";

const toggleLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const likesData = {
      postId,
      userId,
    };

    await reactionIdSchema.parse(likesData);

    const likes = await reactionService.toggleLikes(likesData);

    if (!likes) {
      return res.status(404).json({ error: "User or post not found" });
    }

    res.status(200).json(likes);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const toggleDislikes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const dislikesData = {
      postId,
      userId,
    };

    await reactionIdSchema.parse(dislikesData);

    const dislikes = await reactionService.toggleDislikes(dislikesData);

    if (!dislikes) {
      return res.status(404).json({ error: "User or post not found" });
    }

    res.status(200).json(dislikes);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }
  }
};

export default {
  toggleLikes,
  toggleDislikes,
};
