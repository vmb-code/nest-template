import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function validateDTO<T extends object>(
  dtoClass: new () => T,
  payload: any,
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, payload);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    throw new Error(
      `Validation failed: ${errors
        .map((err) => Object.values(err.constraints ?? {}))
        .flat()
        .join(', ')}`,
    );
  }

  return dtoInstance;
}
