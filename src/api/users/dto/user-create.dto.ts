import {
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
