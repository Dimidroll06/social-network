import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UsersModule, AuthModule, PostsModule],
})
export class ApiModule {}
