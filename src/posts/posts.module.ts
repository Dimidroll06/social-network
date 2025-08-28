import { Module } from '@nestjs/common';
import { Like } from 'src/models/like.entity';
import { Post } from 'src/models/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LikesController } from 'src/likes/likes.controller';
import { LikesService } from 'src/likes/likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like]), AuthModule],
  controllers: [PostsController, LikesController],
  providers: [PostsService, LikesService],
})
export class PostsModule {}
