import type { RequestHandler } from "express";
import type { ApiErrorBody } from "@shared/types";

/** Fallback for unknown routes, shared by every Express service. */
export const notFoundHandler: RequestHandler = (req, res) => {
  const body: ApiErrorBody = {
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: "NOT_FOUND",
    },
  };

  res.status(404).json(body);
};
