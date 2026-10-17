export interface AppErrorOptions {
  code?: string;
  details?: unknown;
}

/** Base class for all expected (HTTP) errors thrown by controllers. */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = options.code;
    this.details = options.details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", options: AppErrorOptions = {}) {
    super(400, message, { code: "BAD_REQUEST", ...options });
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", options: AppErrorOptions = {}) {
    super(401, message, { code: "UNAUTHORIZED", ...options });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", options: AppErrorOptions = {}) {
    super(403, message, { code: "FORBIDDEN", ...options });
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", options: AppErrorOptions = {}) {
    super(404, message, { code: "NOT_FOUND", ...options });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", options: AppErrorOptions = {}) {
    super(409, message, { code: "CONFLICT", ...options });
    this.name = "ConflictError";
  }
}
