import { DiscordProfile, Prisma } from '@prisma/client';
import { AccessToken } from 'simple-oauth2';
import { UserDiscordProfile } from '../types';

export interface IDiscordProfileService {
  save(
    discordId: string,
    tokenDetails: AccessToken,
  ): Promise<UserDiscordProfile>;

  validateDiscordProfile(
    userWhere: Prisma.UserWhereUniqueInput,
  ): Promise<DiscordProfile>;

  get(where: Prisma.DiscordProfileWhereUniqueInput): Promise<DiscordProfile>;
  update(
    where: Prisma.DiscordProfileWhereUniqueInput,
    data: Prisma.DiscordProfileUpdateInput,
  ): Promise<DiscordProfile>;
}
