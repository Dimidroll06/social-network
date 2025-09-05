import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/api/auth/decorators/current-user.decorator';
import { GetUserDto } from 'src/api/users/dto/user-get-dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Лайкнуть пост' })
  @ApiBearerAuth()
  async like(
    @CurrentUser() user: GetUserDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.likesService.like(user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @ApiOperation({ summary: 'Убрать лайк с поста' })
  @ApiBearerAuth()
  async unlike(
    @CurrentUser() user: GetUserDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.likesService.unlike(user, postId);
  }
}
