import { Router } from "express";
import { validateBody } from "@shared/common";
import { config } from "../config";
import { AuthController } from "../controllers/auth.controller";
import { prisma } from "../lib/prisma";
import { createAuthenticateMiddleware } from "../middleware/auth.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";
import { BcryptPasswordHasher } from "../services/password.service";
import { TokenService } from "../services/token.service";

const tokenService = new TokenService(config.jwt);
const authService = new AuthService(
  prisma,
  tokenService,
  new BcryptPasswordHasher(),
);
const authController = new AuthController(authService, config);
const authenticate = createAuthenticateMiddleware(tokenService);

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), authController.register);
authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticate, authController.me);
