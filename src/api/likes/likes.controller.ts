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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_PREFIX } from 'src/config/const';
import { Like } from 'src/models/like.entity';

@Controller(`${API_PREFIX}/posts/:postId/likes`)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Лайкнуть пост' })
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    description: 'Лайк успешно поставлен',
    type: Like,
  })
  @ApiUnauthorizedResponse({
    description: 'Вы не авторизованы',
  })
  @ApiNotFoundResponse({
    description: 'Пост не найден',
  })
  @ApiConflictResponse({
    description: 'Вы уже поставили лайк на этот пост',
  })
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
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    description: 'Лайк успешно убран',
    type: Like,
  })
  @ApiUnauthorizedResponse({
    description: 'Вы не авторизованы',
  })
  @ApiNotFoundResponse({
    description: 'Пост не найден',
  })
  @ApiNotFoundResponse({
    description: 'Вы не поставили лайк на этот пост',
  })
  async unlike(
    @CurrentUser() user: GetUserDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.likesService.unlike(user, postId);
  }
}
