import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@social-network/contracts';
import { AppModule } from './app.module';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: QUEUES.posts,
        queueOptions: { durable: true },
        noAck: false,
        prefetchCount: 10,
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();
}

void bootstrap();
