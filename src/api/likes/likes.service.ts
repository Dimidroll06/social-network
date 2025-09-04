import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/models/like.entity';
import { Post } from 'src/models/post.entity';
import { GetUserDto } from 'src/api/users/dto/user-get-dto';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async like(user: GetUserDto, postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: {
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existLike = post.likes.find((like) => like.userId === user.id);
    if (existLike) {
      throw new ConflictException('You already liked this post');
    }

    const like = new Like();
    like.postId = postId;
    like.userId = user.id;

    await this.likeRepository.save(like);

    return like;
  }

  async unlike(user: GetUserDto, postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: {
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existLike = post.likes.find((like) => like.userId === user.id);
    if (!existLike) {
      throw new NotFoundException(
        'You did not like this post, so you can not unlike it',
      );
    }

    await this.likeRepository.remove(existLike);
    return existLike;
  }
}
