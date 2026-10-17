import { ConflictError, UnauthorizedError } from "@shared/common";
import type { PrismaClient } from "../generated/prisma-client";
import type { PasswordHasher } from "./password.service";
import type { TokenService } from "./token.service";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly tokens: TokenService,
    private readonly hasher: PasswordHasher,
  ) {}

  async register(email: string, password: string): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictError("Email is already registered");
    }

    const passwordHash = await this.hasher.hash(password);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, tokenVersion: true },
    });

    return this.issueTokens(user.id, user.tokenVersion);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, tokenVersion: true },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await this.hasher.verify(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return this.issueTokens(user.id, user.tokenVersion);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const payload = this.tokens.verifyRefreshToken(refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.ver) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Rotate: bump the version so the previous refresh token becomes invalid.
    await this.prisma.user.update({
      where: { id: user.id },
      data: { tokenVersion: { increment: 1 } },
    });

    return this.issueTokens(user.id, user.tokenVersion + 1);
  }

  async logout(refreshToken: string): Promise<void> {
    let payload: { sub: string; ver: number };

    try {
      payload = this.tokens.verifyRefreshToken(refreshToken);
    } catch {
      return; // token is already invalid — nothing to revoke
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.ver) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  async getMe(userId: string): Promise<{ id: string; email: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    return user;
  }

  private issueTokens(userId: string, tokenVersion: number): AuthResult {
    return {
      accessToken: this.tokens.signAccessToken(userId),
      refreshToken: this.tokens.signRefreshToken(userId, tokenVersion),
    };
  }
}
