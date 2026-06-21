import * as z from "zod";

export const postIdSchema = z.object({
  id: z.string(),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Post title must be at least 3 characters long")
    .max(255, "Post title can have a max of 255 characters"),
  content: z
    .string()
    .min(10, "Post content must be at least 3 characters long"),
  featureImg: z.string().optional(),
  author: z.string(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Post title must be at least 3 characters long")
    .max(255, "Post title can have a max of 255 characters")
    .optional(),
  content: z
    .string()
    .min(10, "Post content must be at least 3 characters long")
    .optional(),
  featureImg: z.string().optional(),
});
