import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/db.module';
import { ApiModule } from './api/api.module';
import { ClientModule } from './client/client.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ApiModule,
    ClientModule,

    RouterModule.register([
      {
        path: '/api',
        module: ApiModule,
      },
    ]),
  ],
})
export class AppModule {}
