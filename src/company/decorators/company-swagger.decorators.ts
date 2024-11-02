import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const CreateCompanySwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new company' }),
    ApiResponse({ status: 201, description: 'Company created successfully' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  );
};

export const GetCompanyByIdSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get company by ID' }),
    ApiParam({ name: 'id', required: true, description: 'ID of the company' }),
    ApiResponse({ status: 200, description: 'Company retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Company not found' }),
  );
};

export const GetAllCompaniesSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all companies' }),
    ApiResponse({
      status: 200,
      description: 'Companies retrieved successfully',
    }),
    ApiResponse({ status: 204, description: 'No companies found' }),
  );
};

export const UpdateCompanySwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update company information' }),
    ApiParam({ name: 'id', required: true, description: 'ID of the company' }),
    ApiResponse({ status: 200, description: 'Company updated successfully' }),
    ApiResponse({ status: 404, description: 'Company not found' }),
  );
};
