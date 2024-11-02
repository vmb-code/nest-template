import * as Joi from 'joi';
import { DB_ENV_VALIDATION_SCHEMA } from './validations/db-env.validation';
import { AUTH_ENV_VALIDATION_SCHEMA } from './validations/auth-env.validation';
import { SMTP_ENV_VALIDATION_SCHEMA } from './validations/smtp-env.validation';
export const validationSchema = Joi.object({
  // Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  ...AUTH_ENV_VALIDATION_SCHEMA,
  ...DB_ENV_VALIDATION_SCHEMA,
  ...SMTP_ENV_VALIDATION_SCHEMA,
});
