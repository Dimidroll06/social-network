import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

dotenv.config({ path: join(__dirname, '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('COOKIE_SECRET', 'secret');

  app.use(cookieParser.default(cookieSecret));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
