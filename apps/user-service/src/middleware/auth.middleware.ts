import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@shared/common";
import { AuthService } from "../services/auth.service";
import type { AuthedRequest } from "../types";

export function createAuthenticateMiddleware(authService: AuthService) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      next(new UnauthorizedError("Access token missing"));
      return;
    }

    try {
      const userId = await authService.getUserId(token);
      (req as AuthedRequest).userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  };
}
