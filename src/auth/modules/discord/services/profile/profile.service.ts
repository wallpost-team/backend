import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DiscordProfile, Prisma, User } from '@prisma/client';

import { SERVICES } from 'src/common';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma/prisma.service';

import discordAuthConfig from '../../discordAuth.config';
import { IDiscordProfileService } from './profile.service.interface';

@Injectable()
export class DiscordProfileService implements IDiscordProfileService {
  constructor(
    @Inject(discordAuthConfig.KEY)
    private readonly config: ConfigType<typeof discordAuthConfig>,
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

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

  private async encryptTokens(accessToken: string, refreshToken: string) {
    [accessToken, refreshToken] = await Promise.all([
      this.encryption.encrypt(this.config.encryptionSecret, accessToken),
      this.encryption.encrypt(this.config.encryptionSecret, refreshToken),
    ]);
    return { accessToken, refreshToken };
  }

  decryptToken(
    discordProfile: DiscordProfile,
    token: 'accessToken' | 'refreshToken',
  ) {
    return this.encryption.decrypt(
      this.config.encryptionSecret,
      discordProfile[token],
    );
  }
}

export const discordProfileProvider: Provider = {
  provide: SERVICES.DISCORD_PROFILE,
  useClass: DiscordProfileService,
};
