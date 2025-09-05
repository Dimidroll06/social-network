// src/client/client.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { API_PREFIX } from 'src/config/const';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      serveRoot: '/',
      exclude: [`/${API_PREFIX}*`],
    }),
  ],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const url: string = req.originalUrl;

        if (
          url.startsWith(`/${API_PREFIX}`) ||
          url.includes('.') ||
          url.startsWith('/assets')
        ) {
          return next();
        }

        res.sendFile(
          join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'),
        );
      })
      .forRoutes('*');
  }
}
