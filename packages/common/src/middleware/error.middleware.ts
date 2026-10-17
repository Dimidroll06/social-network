import type { ErrorRequestHandler } from "express";
import type { ApiErrorBody } from "@shared/types";

interface ErrorWithStatus {
  statusCode?: unknown;
  status?: unknown;
  code?: unknown;
  details?: unknown;
}

function resolveStatusCode(error: unknown): number {
  if (typeof error === "object" && error !== null) {
    const { statusCode, status } = error as ErrorWithStatus;

    if (typeof statusCode === "number") return statusCode;
    if (typeof status === "number") return status;
  }

  return 500;
}

/**
 * The single global error middleware shared by every Express service.
 * Register it last, after all routes and notFoundHandler.
 *
 * Express 5 forwards rejected async handlers here automatically, so controllers
 * must never respond from a catch block: throw or call next(error) instead.
 */
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const statusCode = resolveStatusCode(error);
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(`[unhandled-error] ${req.method} ${req.originalUrl}`, error);
  }

  const err = error as ErrorWithStatus & Error;
  const body: ApiErrorBody = {
    error: {
      message: isServerError ? "Internal Server Error" : err.message,
      ...(isServerError
        ? {}
        : {
            ...(typeof err.code === "string" ? { code: err.code } : {}),
            ...(err.details !== undefined ? { details: err.details } : {}),
          }),
    },
  };

  res.status(statusCode).json(body);
};
