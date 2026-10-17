/**
 * Types shared by every workspace (Express services and the React client).
 *
 * This package must stay type-only: no runtime values, no Node or browser APIs.
 * Runtime helpers (logger, zod schemas, error classes) belong to @shared/common.
 */

/** Internal services that make up the backend. */
export type ServiceName = "auth" | "user" | "feed";

/** Response shape of the GET /api/{service}/health endpoints. */
export interface HealthResponse {
  service: ServiceName;
  status: "ok";
  timestamp: string;
}

/** Error response emitted by the global Express error middleware. */
export interface ApiErrorBody {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}
