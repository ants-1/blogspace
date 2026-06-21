import * as z from "zod";

export const deleteCommentSchema = z.object({
  commentId: z.string(),
  postId: z.string(),
  author: z.string(),
});

export const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(3, "Comment length must be at least 3 characters."),
  author: z.string(),
});

export const updateCommentSchema = z.object({
  postId: z.string(),
  commentId: z.string(),
  content: z.string().min(3, "Comment length must be at least 3 characters."),
  author: z.string(),
});
