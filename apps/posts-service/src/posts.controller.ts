import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  PostsPatterns,
  QUEUES,
  type ServicePingResponse,
  type ServiceReadinessResponse,
} from '@social-network/contracts';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class PostsController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern(PostsPatterns.Ping)
  ping(): ServicePingResponse {
    return {
      service: QUEUES.posts,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(PostsPatterns.Readiness)
  async readiness(): Promise<ServiceReadinessResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        service: QUEUES.posts,
        status: 'ok',
        database: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        service: QUEUES.posts,
        status: 'error',
        database: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
