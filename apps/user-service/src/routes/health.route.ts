import { Router } from "express";
import { HealthController } from "../controllers/health.controller";
import { HealthService } from "../services/health.service";

const healthController = new HealthController(new HealthService());

export const healthRouter = Router();

healthRouter.get("/", healthController.health);
