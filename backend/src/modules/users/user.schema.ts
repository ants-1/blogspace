import * as z from "zod";

export const userIdSchema = z.object({
  id: z.string(),
});

export const updateUserSchema = z.object({
  id: z.string(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .optional(),
  email: z.email().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export const updateUserPasswordSchema = z.object({
  id: z.string(),
  currentPassword: z
    .string()
    .min(6, "Password length needs to be at least 6 characters long."),
  newPassword: z
    .string()
    .min(6, "Password length needs to be at least 6 characters long."),
});

export const toggleFollowingSchema = z.object({
  id: z.string(),
  followingId: z.string(),
});
