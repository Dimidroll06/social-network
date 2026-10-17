import { Router } from "express";
import { healthRouter } from "./health.route";

/** Main router of the service: mounts one sub-router per resource. */
export const router = Router();

router.use("/health", healthRouter);
