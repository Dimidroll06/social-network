import type { HealthResponse } from "@shared/types";

export class HealthService {
  getHealth(): HealthResponse {
    return {
      service: "auth",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
