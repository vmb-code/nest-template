import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDocs(
  summary: string,
  successStatus: number,
  successMessage: string,
  errorStatus: number,
  errorMessage: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: successStatus, description: successMessage }),
    ApiResponse({ status: errorStatus, description: errorMessage }),
  );
}
