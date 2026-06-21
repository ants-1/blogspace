import { Request, Response, NextFunction } from "express";
import * as z from "zod";
import commentService from "./comment.service";
import {
  deleteCommentSchema,
  createCommentSchema,
  updateCommentSchema,
} from "./comment.schema";

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { content, author } = req.body;
    const commentData = {
      postId,
      content,
      author,
    };

    await createCommentSchema.parse(commentData);

    const comment = await commentService.createComment(commentData);

    if (!comment) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(201).json(comment);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId, commentId } = req.params;
    const { content, author } = req.body;
    const commentData = {
      postId,
      commentId,
      content,
      author,
    };

    await updateCommentSchema.parse(commentData);

    const updatedComment = await commentService.updateComment(commentData);

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json(updatedComment);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId, postId } = req.params;
    const { author } = req.body;
    const commentData = {
      commentId,
      postId,
      author,
    };

    await deleteCommentSchema.parse(commentData);

    const deletedComment = await commentService.deleteComment(commentData);

    if (!deletedComment) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Comment has been successfully deleted." });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

export default {
  createComment,
  updateComment,
  deleteComment,
};
