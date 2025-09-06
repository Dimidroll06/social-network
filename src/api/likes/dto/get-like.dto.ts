import { ApiProperty } from '@nestjs/swagger';

export class GetLikeDto {
  @ApiProperty({
    description: 'Идентификатор лайка',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Идентификатор поста',
    example: 1,
  })
  postId: number;

  @ApiProperty({
    description: 'Дата создания лайка',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления лайка',
    example: new Date().toISOString(),
  })
  updatedAt: Date;
}
