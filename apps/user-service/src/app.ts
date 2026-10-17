import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "@shared/common";
import { router } from "./routes";

export function createApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");

  // Security headers.
  app.use(helmet());

  // Body parsing.
  app.use(express.json({ limit: "10kb" }));

  // Basic rate limiting, applied to every request.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  app.use("/api/user", router);

  // 404 + the single global error middleware (both from @shared/common). Always last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
