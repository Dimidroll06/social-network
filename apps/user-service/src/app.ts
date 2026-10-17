import express from "express";
import {
  createRequestLogger,
  createSecurityMiddleware,
  errorHandler,
  notFoundHandler,
} from "@shared/common";
import { router } from "./routes";

export function createApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");

  // Request logging via morgan (configured in @shared/common).
  app.use(createRequestLogger("user-service"));

  // Helmet + rate limiting are configured in @shared/common.
  app.use(createSecurityMiddleware());

  // Body parsing.
  app.use(express.json({ limit: "10kb" }));

  app.use("/api/user", router);

  // 404 + the single global error middleware (both from @shared/common). Always last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
