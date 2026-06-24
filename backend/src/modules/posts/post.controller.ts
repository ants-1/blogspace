import { Request, Response, NextFunction } from "express";
import postService from "./post.service";
import { IdParams } from "../../types/types";
import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
} from "./post.schema";
import asyncHandler from "express-async-handler";
import { createResponse } from "../../utils/createResponse";

const getPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPosts();

    res.status(200).json(createResponse(true, result, null));
  },
);

const getPost = asyncHandler(
  async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    const { id } = await postIdSchema.parse(req.params);

    const result = await postService.getPost(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postData = await createPostSchema.parse(req.body);

    const result = await postService.createPost(postData);

    res.status(201).json(createResponse(true, result, null));
  },
);

const updatePost = asyncHandler(
  async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    const { id } = postIdSchema.parse(req.params);

    const updatedPostData = await updatePostSchema.parse(req.body);

    const result = await postService.updatePost(id, updatedPostData);

    res.status(200).json(createResponse(true, result, null));
  },
);

const deletePost = asyncHandler(
  async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    const { id } = await postIdSchema.parse(req.params);

    const result = await postService.deletePost(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
