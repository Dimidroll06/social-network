import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Vanya228',
  })
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;
}
