import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from 'src/users/dto/user-get-dto';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { UsersService } from 'src/users/users.service';
import { TokensInterface } from './dto/tokens-interface';
import { TokensPayload } from './dto/tokens-payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    @Inject('ACCESS_JWT_SERVICE') private accessJwtService: JwtService,
    @Inject('REFRESH_JWT_SERVICE') private refreshJwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<GetUserDto | null> {
    const user = await this.userService.validateUser(email, password);
    return user;
  }

  async login(user: GetUserDto): Promise<TokensInterface> {
    const payload = { username: user.username, sub: user.id };

    const accessToken = await this.accessJwtService.signAsync(payload);
    const refreshToken = await this.refreshJwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(user: CreateUserDto): Promise<void> {
    const existingUser = await this.userService.getUserByEmail(user.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    await this.userService.createUser(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload =
        await this.refreshJwtService.verifyAsync<TokensPayload>(refreshToken);
      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.login(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
