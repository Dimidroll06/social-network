/**
 * Runtime helpers shared by the Express services.
 * Never import this package from the React client.
 */

export { errorHandler } from "./middleware/error.middleware";
export { notFoundHandler } from "./middleware/not-found.middleware";
export { createRequestLogger } from "./middleware/request-logger.middleware";
export { createSecurityMiddleware } from "./middleware/security.middleware";
export type { SecurityMiddlewareOptions } from "./middleware/security.middleware";
export {
  validateBody,
  validateParams,
  validateQuery,
} from "./middleware/validate.middleware";
export { helmetOptions, rateLimitOptions } from "./config/security.config";
export {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./errors/app-error";
export type { AppErrorOptions } from "./errors/app-error";
