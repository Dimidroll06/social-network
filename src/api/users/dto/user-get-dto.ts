import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Vanya228',
  })
  username: string;

  @ApiProperty({
    description: 'email пользователя',
    example: 'user@example.com',
  })
  email: string;
}
