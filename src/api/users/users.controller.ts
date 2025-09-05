import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/api/dto/pagination-query.dto';
import {
  PaginatedResult,
  PaginatedResultDto,
} from 'src/api/interfaces/paginated-result';
import { GetUserDto } from './dto/user-get-dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { API_PREFIX } from 'src/config/const';

@Controller(`${API_PREFIX}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получить пользователей' })
  @ApiOkResponse({
    description: 'Список пользователей',
    type: PaginatedResultDto<GetUserDto>,
  })
  async getUsers(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<GetUserDto>> {
    const users = await this.usersService.getUsers(pagination);
    return users;
  }

  @Get('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiOkResponse({
    description: 'Пользователь',
    type: GetUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
  })
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetUserDto> {
    const user = await this.usersService.getUserById(userId);
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
