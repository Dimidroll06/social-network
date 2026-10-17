import type { ErrorRequestHandler } from "express";
import type { ApiErrorBody } from "@shared/types";

interface ErrorWithStatus {
  statusCode?: unknown;
  status?: unknown;
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
 * Custom error classes will also live in @shared/common.
 */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = resolveStatusCode(error);
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error("[unhandled-error]", error);
  }

  const body: ApiErrorBody = {
    error: {
      message: isServerError ? "Internal Server Error" : (error as Error).message,
    },
  };

  res.status(statusCode).json(body);
};
