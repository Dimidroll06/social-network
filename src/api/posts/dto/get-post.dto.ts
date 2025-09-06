import { ApiProperty } from '@nestjs/swagger';
import { GetLikeDto } from 'src/api/likes/dto/get-like.dto';

export class GetPostDto {
  @ApiProperty({
    description: 'Идентификатор поста',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Сообщение в посте',
    example: 'Всем привет! Это мой новый пост',
  })
  message: string;

  @ApiProperty({
    description: 'Идентификатор автора поста',
    example: 1,
  })
  authorId: number;

  @ApiProperty({
    description: 'Лайки поста',
    example: [
      {
        id: 1,
        userId: 1,
        postId: 1,
      },
    ],
  })
  likes: [GetLikeDto];

  @ApiProperty({
    description: 'Дата создания поста',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата обновления поста',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
