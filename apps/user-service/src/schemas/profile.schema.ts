import { z } from "zod";

export const createProfileSchema = z.object({
  nickname: z.string().trim().min(3).max(30),
  description: z.string().trim().max(160).optional(),
});

export const updateProfileSchema = z
  .object({
    nickname: z.string().trim().min(3).max(30).optional(),
    description: z.string().trim().max(160).optional(),
  })
  .refine((data) => data.nickname !== undefined || data.description !== undefined, {
    message: "Provide at least one field to update",
  });

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
