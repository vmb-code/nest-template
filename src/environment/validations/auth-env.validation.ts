import * as Joi from 'joi';

export const AUTH_ENV_VALIDATION_SCHEMA = {
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
};
