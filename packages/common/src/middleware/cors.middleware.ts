import cors from "cors";
import type { CorsOptions } from "cors";

function parseOrigins(value: string | undefined): string[] {
  return (value ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** CORS for browser clients; credentials are required for the refresh cookie. */
export function createCorsMiddleware(origins = parseOrigins(process.env.CORS_ORIGINS)) {
  const options: CorsOptions = {
    credentials: true,
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin is not allowed"));
    },
  };

  return cors(options);
}

