/**
 * Environment-based configuration for user-service.
 * Values come from process.env (docker-compose etc.) with local defaults.
 */
export const config = {
  serviceName: "user-service",
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4002),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  // URLs of the other services, used for inter-service HTTP calls.
  services: {
    auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:4001",
    user: process.env.USER_SERVICE_URL ?? "http://localhost:4002",
    feed: process.env.FEED_SERVICE_URL ?? "http://localhost:4003",
  },
};
