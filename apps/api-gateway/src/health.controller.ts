import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  POSTS_SERVICE,
  PostsPatterns,
  USERS_SERVICE,
  UsersPatterns,
  type ServicePingResponse,
} from '@social-network/contracts';
import { firstValueFrom } from 'rxjs';

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
}
