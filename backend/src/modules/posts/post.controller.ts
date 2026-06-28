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
import { uploadImage } from "../../utils/uploadHelper";

const getPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await postService.getPosts(page, limit);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getPopularPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPopularPosts();

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

    let featureImgUrl = "";

    if (req.file) {
      const uploaded = await uploadImage(req.file.buffer);
      featureImgUrl = uploaded.secure_url;
    }

    const result = await postService.createPost({
      ...postData,
      featureImg: featureImgUrl,
    });

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
  getPopularPosts,
  createPost,
  updatePost,
  deletePost,
};
