/**
 * Environment-based configuration for auth-service.
 * Values come from process.env (docker-compose etc.) with local defaults.
 */
export const config = {
  serviceName: "auth-service",
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4001),

  // URLs of the other services, used for inter-service HTTP calls.
  services: {
    auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:4001",
    user: process.env.USER_SERVICE_URL ?? "http://localhost:4002",
    feed: process.env.FEED_SERVICE_URL ?? "http://localhost:4003",
  },
};
