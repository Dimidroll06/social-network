import type { Request, Response } from "express";
import { UnauthorizedError } from "@shared/common";
import type { config } from "../config";
import type { AuthService } from "../services/auth.service";
import type { AuthedRequest } from "../types";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cfg: typeof config,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };
    const tokens = await this.authService.register(email, password);

    this.setRefreshCookie(res, tokens.refreshToken);
    res.status(201).json({ accessToken: tokens.accessToken });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };
    const tokens = await this.authService.login(email, password);

    this.setRefreshCookie(res, tokens.refreshToken);
    res.status(200).json({ accessToken: tokens.accessToken });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = this.readRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token missing");
    }

    const tokens = await this.authService.refresh(refreshToken);

    this.setRefreshCookie(res, tokens.refreshToken);
    res.status(200).json({ accessToken: tokens.accessToken });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = this.readRefreshToken(req);

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    this.clearRefreshCookie(res);
    res.status(204).send();
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.getMe((req as AuthedRequest).userId);
    res.status(200).json(user);
  };

  private readRefreshToken(req: Request): string | undefined {
    return req.cookies?.[this.cfg.cookie.name] as string | undefined;
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(this.cfg.cookie.name, token, {
      httpOnly: true,
      secure: this.cfg.cookie.secure,
      sameSite: "strict",
      path: "/api/auth",
      maxAge: this.cfg.jwt.refreshTtlSeconds * 1000,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(this.cfg.cookie.name, {
      httpOnly: true,
      path: "/api/auth",
    });
  }
}
