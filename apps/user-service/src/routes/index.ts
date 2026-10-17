import { Router } from "express";
import { healthRouter } from "./health.route";
import { profileRouter } from "./profile.route";

/** Main router of the service: mounts one sub-router per resource. */
export const router = Router();

router.use("/health", healthRouter);
router.use("/profile", profileRouter);
