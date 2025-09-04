import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  message: string;
}
