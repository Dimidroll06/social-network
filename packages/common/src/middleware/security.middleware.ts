import type { RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import type { Options as RateLimitOptions } from "express-rate-limit";
import helmet from "helmet";
import type { HelmetOptions } from "helmet";
import { helmetOptions, rateLimitOptions } from "../config/security.config";

export interface SecurityMiddlewareOptions {
  helmet?: HelmetOptions;
  rateLimit?: Partial<RateLimitOptions>;
}

/**
 * Helmet + rate limiting configured in one place for every service.
 * Returns fresh instances, so each Express app gets its own limiter store.
 */
export function createSecurityMiddleware(
  options: SecurityMiddlewareOptions = {},
): RequestHandler[] {
  return [
    helmet({ ...helmetOptions, ...options.helmet }),
    rateLimit({ ...rateLimitOptions, ...options.rateLimit }),
  ];
}
