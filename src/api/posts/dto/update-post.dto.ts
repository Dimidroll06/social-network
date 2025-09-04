import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  message: string;
}
