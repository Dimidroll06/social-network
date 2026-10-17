import type { HealthResponse } from "@shared/types";

export class HealthService {
  getHealth(): HealthResponse {
    return {
      service: "user",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
