import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/api/auth/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUserDto } from 'src/api/users/dto/user-get-dto';
import { Post as PostEntity } from 'src/models/post.entity';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_PREFIX } from 'src/config/const';
import { GetPostDto } from './dto/get-post.dto';

@Controller(`${API_PREFIX}/posts`)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Создать пост' })
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    description: 'Пост успешно создан',
    type: GetPostDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Вы не авторизованы',
  })
  async create(
    @CurrentUser() author: GetUserDto,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.create(author, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все посты' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пост по id' })
  @ApiOkResponse({
    description: 'Пост успешно найден',
    type: GetPostDto,
  })
  @ApiNotFoundResponse({
    description: 'Пост не найден',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Обновить пост' })
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    description: 'Пост успешно обновлен',
    type: GetPostDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Вы не авторизованы',
  })
  async update(
    @CurrentUser() author: GetUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== author.id) {
      throw new ForbiddenException('You are not allowed to edit this post');
    }
    return await this.postsService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пост' })
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    description: 'Пост успешно удален',
    type: GetPostDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Вы не авторизованы',
  })
  @ApiNotFoundResponse({
    description: 'Пост не найден',
  })
  async remove(
    @CurrentUser() author: GetUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostEntity> {
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== author.id) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    return await this.postsService.remove(id);
  }
}
