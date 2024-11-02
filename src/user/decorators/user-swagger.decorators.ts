import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/decorators/swagger.decorators';

export const CreateUserSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user for a specific company' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'ID of the company',
    }),
    ApiResponse({ status: 201, description: 'User created successfully' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - No access to this company',
    }),
  );
};

export const RequestPasswordResetSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Request a password reset' }),
    ApiResponse({
      status: 200,
      description: 'Password reset request successful',
    }),
    ApiResponse({ status: 400, description: 'Invalid email address' }),
  );
};

export const ResetPasswordSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Reset the password' }),
    ApiResponse({ status: 204, description: 'Password reset successful' }),
    ApiResponse({ status: 400, description: 'Invalid token or new password' }),
  );
};

export const GetUserByIdSwagger = () => {
  return ApiDocs(
    'Get user by ID',
    200,
    'User retrieved successfully',
    404,
    'User not found',
  );
};

export const GetAllUsersSwagger = () => {
  return ApiDocs(
    'Get all users',
    200,
    'Users retrieved successfully',
    204,
    'No Users found',
  );
};

export const UpdateUserSwagger = () => {
  return ApiDocs(
    'Update user',
    200,
    'User updated successfully',
    400,
    'Unsuccessful update',
  );
};

export const UpdatePasswordSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update user password' }),
    ApiResponse({ status: 200, description: 'Password updated successfully' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};
