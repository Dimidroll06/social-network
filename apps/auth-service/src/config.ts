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

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret",
    // Lifetimes in seconds.
    accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 15 * 60),
    refreshTtlSeconds: Number(
      process.env.JWT_REFRESH_TTL_SECONDS ?? 7 * 24 * 60 * 60,
    ),
  },

  cookie: {
    name: "refreshToken",
    secure: process.env.NODE_ENV === "production",
  },
};
