import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokensPayload } from '../dto/tokens-payload';
import { UsersService } from 'src/users/users.service';
import { GetUserDto } from 'src/users/dto/user-get-dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_JWT_SECRET', 'secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokensPayload): Promise<GetUserDto> {
    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        `User with id ${payload.sub} does not exist`,
      );
    }

    return user;
  }
}
