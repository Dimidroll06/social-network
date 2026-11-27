import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  PostsPatterns,
  QUEUES,
  type ServicePingResponse,
} from '@social-network/contracts';

@Controller()
export class PostsController {
  @MessagePattern(PostsPatterns.Ping)
  ping(): ServicePingResponse {
    return {
      service: QUEUES.posts,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
