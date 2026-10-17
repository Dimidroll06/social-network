import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  password: z.string().min(8).max(72),
});

export const loginSchema = registerSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
