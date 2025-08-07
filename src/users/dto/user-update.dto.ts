/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;
}
