import { User } from '@prisma/client';

export type UserNoTokens = Omit<
  User,
  'discordAccessToken' | 'discordRefreshToken'
>;
