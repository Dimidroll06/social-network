import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/types/requset-with-user.type';
import { GetUserDto } from 'src/users/dto/user-get-dto';

export const CurrentUser = createParamDecorator<any, GetUserDto>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
