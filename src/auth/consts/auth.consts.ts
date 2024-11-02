import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/global.enums';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

export const TOKEN_EXPIRY = Object.freeze({
  ACCESS_TOKEN_MINUTES: 15,
  REFRESH_TOKEN_MINUTES: 60,
});
