/**
 * Environment-based configuration for the client.
 * Values come from VITE_* env variables with nginx-relative defaults.
 */
export const config = {
  // URLs of the backend services the client talks to.
  api: {
    auth: import.meta.env.VITE_AUTH_SERVICE_URL ?? "/api/auth",
    user: import.meta.env.VITE_USER_SERVICE_URL ?? "/api/user",
    feed: import.meta.env.VITE_FEED_SERVICE_URL ?? "/api/feed",
  },
};
