import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  QUEUES,
  UsersPatterns,
  type ServicePingResponse,
  type ServiceReadinessResponse,
} from '@social-network/contracts';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern(UsersPatterns.Ping)
  ping(): ServicePingResponse {
    return {
      service: QUEUES.users,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(UsersPatterns.Readiness)
  async readiness(): Promise<ServiceReadinessResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        service: QUEUES.users,
        status: 'ok',
        database: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        service: QUEUES.users,
        status: 'error',
        database: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
