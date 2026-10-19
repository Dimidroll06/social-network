import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().trim().min(1).max(280),
});

export const postIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const feedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type FeedQuery = z.infer<typeof feedQuerySchema>;

