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
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { PaginatedResult } from 'src/interfaces/paginated-result';
import { GetUserDto } from './dto/user-get-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async getUsers(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<GetUserDto>> {
    const users = await this.usersService.getUsers(pagination);
    return users;
  }

  @Get('/:userId')
  @HttpCode(200)
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
