import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DiscordProfile, Prisma } from '@prisma/client';
import { AccessToken } from 'simple-oauth2';
import { User } from '@prisma/client';
import { SERVICES } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

import discordAuthConfig from '../../discordAuth.config';
import { IDiscordAuthService } from '../auth/auth.service.interface';
import { IDiscordProfileService } from './profile.service.interface';
import { UserDiscordProfile } from '../types';

@Injectable()
export class DiscordProfileService implements IDiscordProfileService {
  constructor(
    @Inject(discordAuthConfig.KEY)
    private readonly config: ConfigType<typeof discordAuthConfig>,
    private readonly prisma: PrismaService,
    @Inject(SERVICES.DISCORD_AUTH)
    private readonly discordAuth: IDiscordAuthService,
  ) {}

  async save(discordId: string, tokenDetails: AccessToken) {
    const encryptedTokenDetails = await this.discordAuth.encryptTokenDetails(
      tokenDetails,
    );

    const data = { discordId, tokenDetails: encryptedTokenDetails };
    return this.prisma.discordProfile.upsert({
      where: { discordId },
      update: data,
      create: { ...data, user: { create: {} } },
      include: { user: true },
    }) as Promise<UserDiscordProfile>;
  }

  async validateDiscordProfile(
    userWhere: Prisma.UserWhereUniqueInput,
  ): Promise<DiscordProfile> {
    const discordProfile = await this.prisma.user
      .findUnique({ where: userWhere })
      .discordProfile();
    if (!discordProfile)
      throw new NotFoundException('Discord profile Not Found.');
    return discordProfile;
  }

  async get(
    where: Prisma.DiscordProfileWhereUniqueInput,
  ): Promise<DiscordProfile> {
    const discordProfile = await this.prisma.discordProfile.findUnique({
      where,
    });
    if (!discordProfile)
      throw new NotFoundException('Discord profile Not Found.');
    return discordProfile;
  }

  async update(
    where: Prisma.DiscordProfileWhereUniqueInput,
    data: Prisma.DiscordProfileUpdateInput,
  ) {
    return this.prisma.discordProfile.update({ where, data });
  }
}

export const discordProfileProvider: Provider = {
  provide: SERVICES.DISCORD_PROFILE,
  useClass: DiscordProfileService,
};
