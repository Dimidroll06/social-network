import type { RequestHandler } from "express";
import type { z } from "zod";
import { BadRequestError } from "../errors/app-error";

type ValidationTarget = "body" | "query" | "params";

function validate(target: ValidationTarget, schema: z.ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(
      (req as unknown as Record<string, unknown>)[target],
    );

    if (!result.success) {
      return next(new BadRequestError("Validation failed", { details: result.error.flatten() }));
    }

    (req as unknown as Record<string, unknown>)[target] = result.data;
    return next();
  };
}

export const validateBody = (schema: z.ZodTypeAny): RequestHandler =>
  validate("body", schema);

export const validateQuery = (schema: z.ZodTypeAny): RequestHandler =>
  validate("query", schema);

export const validateParams = (schema: z.ZodTypeAny): RequestHandler =>
  validate("params", schema);
