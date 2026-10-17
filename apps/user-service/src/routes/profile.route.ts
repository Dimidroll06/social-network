import { Router } from "express";
import { validateBody } from "@shared/common";
import { config } from "../config";
import { ProfileController } from "../controllers/profile.controller";
import { prisma } from "../lib/prisma";
import { createAuthenticateMiddleware } from "../middleware/auth.middleware";
import { createProfileSchema, updateProfileSchema } from "../schemas/profile.schema";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";

const authService = new AuthService(config.services.auth);
const profileService = new ProfileService(prisma);
const profileController = new ProfileController(profileService);
const authenticate = createAuthenticateMiddleware(authService);

export const profileRouter = Router();

profileRouter.post("/", validateBody(createProfileSchema), authenticate, profileController.create);
profileRouter.get("/me", authenticate, profileController.me);
profileRouter.patch("/", validateBody(updateProfileSchema), authenticate, profileController.update);
