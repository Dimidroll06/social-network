import type { Options as RateLimitOptions } from "express-rate-limit";
import type { HelmetOptions } from "helmet";

/** Helmet settings shared by every service. */
export const helmetOptions = {} satisfies HelmetOptions;

/** Basic rate limiting shared by every service. */
export const rateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
} satisfies Partial<RateLimitOptions>;
