/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
  Res,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import type { RequestWithUser } from 'src/types/requset-with-user.type';
import { CreateUserDto } from 'src/api/users/dto/user-create.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { API_PREFIX } from 'src/config/const';
import { GetUserDto } from '../users/dto/user-get-dto';

@Controller(`${API_PREFIX}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Войти' })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    description: 'Вход выполнен успешно',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'access.jwt.token',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Неверный логин или пароль',
  })
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Зарегестрироваться' })
  @ApiOkResponse({
    description: 'Регистрация прошла успешно',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'User registered successfully. Please log in to continue.',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный логин или пароль',
  })
  async register(@Body() user: CreateUserDto) {
    await this.authService.register(user);
    return {
      message: 'User registered successfully. Please log in to continue.',
    };
  }

  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Обновить access токен' })
  @ApiOkResponse({
    description: 'Токены обновлены',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'access.jwt.token',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Токен не предоставлен или устарел',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Получить информацию о себе' })
  @ApiOkResponse({
    description: 'Информация о пользователе',
    type: GetUserDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Токен не предоставлен или устарел. Пожалуйста, войдите в систему снова',
  })
  getProfile(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }

    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Выйти' })
  @ApiOkResponse({
    description: 'Выход выполнен успешно',
  })
  @ApiUnauthorizedResponse({
    description:
      'Токен не предоставлен или устарел. Пожалуйста, войдите в систему снова',
  })
  @ApiResponse({
    status: 200,
  })
  logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    req.logout((err) => {
      if (err) {
        console.error('Error occurred while logging out user', err);
      }
    });

    return { message: 'Logged out successfully' };
  }
}
