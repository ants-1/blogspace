import { Request, Response, NextFunction } from "express";
import postService from "./post.service";
import * as z from "zod";
import { IdParams } from "../../types/types";
import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
} from "./post.schema";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postService.getPosts();

    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getPost = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await postIdSchema.parse({ id });

    const post = await postService.getPost(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, featureImg, author } = req.body;
    const postData = {
      title,
      content,
      featureImg,
      author,
    };
    await createPostSchema.parse(postData);

    const post = await postService.createPost(postData);

    if (!post) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json(post);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);
      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, content, featureImg } = req.body;
    const postData = {
      title,
      content,
      featureImg,
    };
    await updatePostSchema.parse(postData);

    const updatedPost = await postService.updatePost(id, postData);

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(updatedPost);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);

      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    await postIdSchema.parse({ id });

    const deletedPost = await postService.deletePost(id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post has been successfully deleted." });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const validationError = z.prettifyError(error);

      return res.status(400).json({ error: validationError });
    }

    res.status(500).json({ error: error.message });
  }
};

export default {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
