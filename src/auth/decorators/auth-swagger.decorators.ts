import { ApiDocs } from 'src/common/decorators/swagger.decorators';

export const SignInSwagger = () => {
  return ApiDocs(
    'Sign in a user',
    200,
    'Successfully signed in',
    401,
    'Unauthorized',
  );
};

export const LogoutSwagger = () => {
  return ApiDocs(
    'Logout a user',
    200,
    'Successfully logged out',
    401,
    'Unauthorized',
  );
};

export const RefreshTokenSwagger = () => {
  return ApiDocs(
    'Refresh access token',
    200,
    'Token refreshed successfully',
    401,
    'Failed to refresh token',
  );
};

export const GetCurrentUserSwagger = () => {
  return ApiDocs(
    'Get current user',
    200,
    'Current user retrieved successfully',
    401,
    'Unauthorized',
  );
};
