import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  POSTS_SERVICE,
  PostsPatterns,
  USERS_SERVICE,
  UsersPatterns,
  type ServicePingResponse,
  type ServiceReadinessResponse,
} from '@social-network/contracts';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';

const READINESS_TIMEOUT_MS = 3000;

@Controller('health')
export class HealthController {
  constructor(
    @Inject(USERS_SERVICE) private readonly users: ClientProxy,
    @Inject(POSTS_SERVICE) private readonly posts: ClientProxy,
  ) {}

  @Get('services')
  async services() {
    const [users, posts] = await Promise.all([
      firstValueFrom(
        this.users.send<ServicePingResponse>(UsersPatterns.Ping, {}),
      ),
      firstValueFrom(
        this.posts.send<ServicePingResponse>(PostsPatterns.Ping, {}),
      ),
    ]);

    return { users, posts };
  }

  @Get('ready')
  async ready() {
    const checks = await Promise.all([
      this.check('users-service', this.users, UsersPatterns.Readiness),
      this.check('posts-service', this.posts, PostsPatterns.Readiness),
    ]);

    if (checks.some((check) => check.status !== 'ok')) {
      throw new ServiceUnavailableException({ status: 'error', checks });
    }

    return { status: 'ok', checks };
  }

  private check(
    service: string,
    client: ClientProxy,
    pattern: string,
  ): Promise<ServiceReadinessResponse> {
    return firstValueFrom(
      client.send<ServiceReadinessResponse>(pattern, {}).pipe(
        timeout(READINESS_TIMEOUT_MS),
        catchError(() =>
          of({
            service,
            status: 'error' as const,
            database: 'error' as const,
            timestamp: new Date().toISOString(),
          }),
        ),
      ),
    );
  }
}
