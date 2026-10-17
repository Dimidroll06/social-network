import type { Request, Response } from "express";
import type { HealthResponse } from "@shared/types";
import type { HealthService } from "../services/health.service";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Arrow function so the method keeps `this` when Express calls it.
  health = (_req: Request, res: Response<HealthResponse>): void => {
    res.status(200).json(this.healthService.getHealth());
  };
}
