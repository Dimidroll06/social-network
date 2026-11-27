import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@social-network/contracts';
import { AppModule } from './app.module';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // HTTP остаётся для фронтенда, RabbitMQ — для общения с микросервисами.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: QUEUES.gateway,
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 10,
    },
  });

  app.enableShutdownHooks();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
