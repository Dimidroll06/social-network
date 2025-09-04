import { Injectable } from '@nestjs/common';
import { Post } from 'src/models/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUserDto } from 'src/api/users/dto/user-get-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(
    author: GetUserDto,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const post = new Post();
    post.message = createPostDto.message;
    post.authorId = author.id;

    await this.postRepository.save(post);
    return post;
  }

  findAll() {}

  async findOne(id: number): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    post.message = updatePostDto.message;

    await this.postRepository.save(post);

    return post;
  }

  async remove(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }
    await this.postRepository.remove(post);

    return post;
  }
}
