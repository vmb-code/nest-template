import * as Joi from 'joi';

export const DB_ENV_VALIDATION_SCHEMA = {
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
};
