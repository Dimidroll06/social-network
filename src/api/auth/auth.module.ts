import { Module } from '@nestjs/common';
import { UsersModule } from 'src/api/users/users.module';
import { AuthService } from './auth.service';
import { UsersService } from 'src/api/users/users.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [UsersModule, JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'ACCESS_JWT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('ACCESS_JWT_SECRET', 'secret'),
          signOptions: {
            expiresIn: configService.get<string | number>(
              'ACCESS_JWT_LIFETIME',
              '15m',
            ),
          },
        });
      },
    },
    {
      provide: 'REFRESH_JWT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('REFRESH_JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>(
              'REFRESH_JWT_LIFETIME',
              '30d',
            ),
          },
        });
      },
    },
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
