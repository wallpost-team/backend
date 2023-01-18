import Joi from 'joi';

export default Joi.object({
  APP_HOST: Joi.string().uri(),
  APP_PORT: Joi.number().default(3333),
  APP_COOKIE_SECRET: Joi.string().required(),

  AUTH_JWT_ACCESS_SECRET: Joi.string().required(),
  AUTH_JWT_ACCESS_TTL: Joi.number().default(30), // 30 seconds
  AUTH_JWT_REFRESH_SECRET: Joi.string().required(),
  AUTH_JWT_REFRESH_TTL: Joi.number().default(1209600), // 2 weeks

  DISCORD_AUTH_ENCRYPTION_SECRET: Joi.string(),

  POSTGRES_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),

  DISCORD_AUTH_CLIENT_ID: Joi.number().unsafe().required(),
  DISCORD_AUTH_CLIENT_SECRET: Joi.string().required(),
  DISCORD_AUTH_CALLBACK_URL: Joi.string().uri().required(),

  DISCORD_API_TOKEN: Joi.string().required(),
});
