import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "@shared/common";
import type { config } from "../config";

type JwtConfig = (typeof config)["jwt"];
type TokenType = "access" | "refresh";

export interface AccessTokenPayload {
  sub: string;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
  ver: number;
}

export class TokenService {
  constructor(private readonly jwtConfig: JwtConfig) {}

  signAccessToken(sub: string): string {
    return jwt.sign({ sub, type: "access" }, this.jwtConfig.accessSecret, {
      expiresIn: this.jwtConfig.accessTtlSeconds,
    });
  }

  signRefreshToken(sub: string, ver: number): string {
    return jwt.sign(
      { sub, type: "refresh", ver },
      this.jwtConfig.refreshSecret,
      { expiresIn: this.jwtConfig.refreshTtlSeconds },
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.verify(token, this.jwtConfig.accessSecret, "access") as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = this.verify(token, this.jwtConfig.refreshSecret, "refresh");

    if (typeof payload.ver !== "number") {
      throw new UnauthorizedError("Invalid token");
    }

    return payload as RefreshTokenPayload;
  }

  private verify(token: string, secret: string, expectedType: TokenType): JwtPayload {
    let decoded: string | JwtPayload;

    try {
      decoded = jwt.verify(token, secret);
    } catch {
      throw new UnauthorizedError("Invalid token");
    }

    if (
      typeof decoded === "string" ||
      decoded.type !== expectedType ||
      typeof decoded.sub !== "string"
    ) {
      throw new UnauthorizedError("Invalid token");
    }

    return decoded;
  }
}
