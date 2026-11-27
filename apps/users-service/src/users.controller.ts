import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  QUEUES,
  UsersPatterns,
  type ServicePingResponse,
} from '@social-network/contracts';

@Controller()
export class UsersController {
  @MessagePattern(UsersPatterns.Ping)
  ping(): ServicePingResponse {
    return {
      service: QUEUES.users,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
