import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadDTO } from 'src/auth/dto/user-payload.dto';
import { validateDTO } from '../utils/validate.utils';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<UserPayloadDTO> => {
    const request = ctx.switchToHttp().getRequest();
    return await validateDTO(UserPayloadDTO, request.user);
  },
);
