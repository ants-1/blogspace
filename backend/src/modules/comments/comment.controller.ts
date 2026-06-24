import { Request, Response, NextFunction } from "express";
import commentService from "./comment.service";
import {
  deleteCommentSchema,
  createCommentSchema,
  updateCommentSchema,
} from "./comment.schema";
import { createResponse } from "../../utils/createResponse";
import asyncHandler from "express-async-handler";

const createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentData = await createCommentSchema.parse({
      postId: req.params.postId,
      content: req.body.content,
      author: req.body.author,
    });

    const result = await commentService.createComment(commentData);

    res.status(201).json(createResponse(true, result, null));
  },
);

const updateComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentData = await updateCommentSchema.parse({
      postId: req.params.postId,
      commentId: req.params.commentId,
      content: req.body.content,
      author: req.body.author,
    });

    const result = await commentService.updateComment(commentData);

    res.status(200).json(createResponse(true, result, null));
  },
);

const deleteComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentData = await deleteCommentSchema.parse({
      commentId: req.params.commentId,
      postId: req.params.postId,
      author: req.body.author,
    });

    const result = await commentService.deleteComment(commentData);

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  createComment,
  updateComment,
  deleteComment,
};
