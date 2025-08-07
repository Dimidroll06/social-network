import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseType = configService.get<'sqlite' | 'postgres'>(
    'DATABASE_TYPE',
  );

  if (databaseType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get<string>('SQLITE_PATH'),
      autoLoadEntities: true,
    };
  } else if (databaseType === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USERNAME'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('POSTGRES_DATABASE'),
      autoLoadEntities: true,
    };
  }

  throw new Error(`Unsupported database type: ${databaseType}`);
};
