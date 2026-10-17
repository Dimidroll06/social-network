import type { RequestHandler } from "express";
import morgan from "morgan";

/**
 * Morgan-based request logger shared by every service.
 * Prefixes each log line with the service name, e.g. "[auth-service]".
 */
export function createRequestLogger(serviceName: string): RequestHandler {
  return morgan(
    `[${serviceName}] :method :url :status :res[content-length] - :response-time ms`,
  );
}
