import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Vanya228',
  })
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'сильный пароль пользователя',
    example: '!Qwerty1234',
  })
  @IsStrongPassword()
  password: string;
}
