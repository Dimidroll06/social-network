// src/client/client.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      serveRoot: '/',
      exclude: ['/api*'],
    }),
  ],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const url: string = req.originalUrl;

        if (
          url.startsWith('/api') ||
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
