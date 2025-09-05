import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Сообщение в посте',
    example: 'Всем привет! Это мой новый пост',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  message: string;
}
