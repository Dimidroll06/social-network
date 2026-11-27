import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  POSTS_SERVICE,
  QUEUES,
  USERS_SERVICE,
} from '@social-network/contracts';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: QUEUES.users,
          queueOptions: { durable: true },
        },
      },
      {
        name: POSTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: QUEUES.posts,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
