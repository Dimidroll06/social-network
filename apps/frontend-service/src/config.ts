/**
 * Environment-based configuration for the client.
 * Values come from VITE_* env variables (docker-compose etc.) with local defaults.
 */
export const config = {
  // URLs of the backend services the client talks to.
  api: {
    auth: import.meta.env.VITE_AUTH_SERVICE_URL ?? "http://localhost:4001",
    user: import.meta.env.VITE_USER_SERVICE_URL ?? "http://localhost:4002",
    feed: import.meta.env.VITE_FEED_SERVICE_URL ?? "http://localhost:4003",
  },
};
