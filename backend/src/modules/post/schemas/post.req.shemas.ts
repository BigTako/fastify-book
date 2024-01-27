import { z } from "zod";
import { postCore } from "./post.core";

export const createPostSchema = z.object({
  ...postCore,
});

export const createPostServiceSchema = z.object({
  ...postCore,
  authorId: z.number(),
});
export const updatePostSchema = z.object({
  title: postCore.title.optional(),
  content: postCore.content.optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreatePostServiceInput = z.infer<typeof createPostServiceSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
