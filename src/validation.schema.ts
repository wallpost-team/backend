import Joi from 'joi';

export default Joi.object({
  APP_PORT: Joi.number().default(3333),
  AUTH_JWT_ACCESS_SECRET: Joi.string().required(),
  AUTH_JWT_REFRESH_SECRET: Joi.string().required(),
  POSTGRES_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  DISCORD_CLIENT_ID: Joi.number().unsafe().required(),
  DISCORD_CLIENT_SECRET: Joi.string().required(),
  DISCORD_CALLBACK_URL: Joi.string().uri().required(),
});
