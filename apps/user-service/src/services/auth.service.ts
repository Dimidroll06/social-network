import { UnauthorizedError } from "@shared/common";

interface AuthMeResponse {
  id?: string;
  email?: string;
}

/** Client for auth-service: validates an access token and returns the user id. */
export class AuthService {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs = 5000,
  ) {}

  async getUserId(accessToken: string): Promise<string> {
    const url = this.baseUrl.replace(/[/]+$/, "") + "/api/auth/me";

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { authorization: "Bearer " + accessToken },
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch {
      throw new UnauthorizedError("Auth service is unavailable");
    }

    if (!response.ok) {
      throw new UnauthorizedError("Invalid access token");
    }

    const user = (await response.json()) as AuthMeResponse;
    if (!user.id) {
      throw new UnauthorizedError("Invalid access token");
    }

    return user.id;
  }
}
