import { Request } from 'express';
import { GetUserDto } from 'src/api/users/dto/user-get-dto';

export interface RequestWithUser extends Request {
  user: GetUserDto;
}
