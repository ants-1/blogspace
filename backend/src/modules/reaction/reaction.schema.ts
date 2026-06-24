import * as z from "zod";

export const reactionIdSchema = z.object({
  postId: z.string(),
  userId: z.string(),
});
