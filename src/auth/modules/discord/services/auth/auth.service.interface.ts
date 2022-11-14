import { Prisma, User } from '@prisma/client';

export interface IDiscordAuthService {
  validateDiscordAuth(data: Prisma.DiscordProfileCreateInput): Promise<User>;
}
