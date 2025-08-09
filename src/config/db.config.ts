import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from '../models/entities';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseType = configService.get<'sqlite' | 'postgres'>(
    'DATABASE_TYPE',
  );

  console.log(entities);

  if (databaseType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get<string>('SQLITE_PATH'),
      logging: configService.get<boolean>('DB_LOGGING', true),
      entities,
      synchronize: true,
    };
  } else if (databaseType === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USERNAME'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('POSTGRES_DATABASE'),
      logging: configService.get<boolean>('DB_LOGGING', true),
      entities,
      synchronize: true,
    };
  }

  throw new Error(`Unsupported database type: ${databaseType}`);
};
