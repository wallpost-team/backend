import { DiscordProfile, Prisma } from '@prisma/client';

export interface IDiscordProfileService {
  validateDiscordProfile(
    userWhere: Prisma.UserWhereUniqueInput,
  ): Promise<DiscordProfile>;

  get(where: Prisma.DiscordProfileWhereUniqueInput): Promise<DiscordProfile>;
}
