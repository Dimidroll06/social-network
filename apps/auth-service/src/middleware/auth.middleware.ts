import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@shared/common";
import { TokenService } from "../services/token.service";
import type { AuthedRequest } from "../types";

export function createAuthenticateMiddleware(tokens: TokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      next(new UnauthorizedError("Access token missing"));
      return;
    }

    try {
      const payload = tokens.verifyAccessToken(token);
      (req as AuthedRequest).userId = payload.sub;
      next();
    } catch (error) {
      next(error);
    }
  };
}
