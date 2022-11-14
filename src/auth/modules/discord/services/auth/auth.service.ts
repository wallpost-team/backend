import { Inject, Injectable, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';

import { SERVICES } from 'src/common';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma/prisma.service';

import discordAuthConfig from '../../discordAuth.config';
import { IDiscordAuthService } from './auth.service.interface';

@Injectable()
export class DiscordAuthService implements IDiscordAuthService {
  constructor(
    @Inject(discordAuthConfig.KEY)
    private readonly config: ConfigType<typeof discordAuthConfig>,
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async validateDiscordAuth(data: Prisma.DiscordProfileCreateInput) {
    const encryptedTokens = await this.encryptTokens(
      data.accessToken,
      data.refreshToken,
    );

    data = { ...data, ...encryptedTokens };

    const discordProfile = await this.prisma.discordProfile.upsert({
      where: { discordId: data.discordId },
      update: data,
      create: { ...data, user: { create: {} } },
      include: { user: true },
    });

    return discordProfile.user as User;
  }

  private async encryptTokens(accessToken: string, refreshToken: string) {
    [accessToken, refreshToken] = await Promise.all([
      this.encryption.encrypt(this.config.encryptionSecret, accessToken),
      this.encryption.encrypt(this.config.encryptionSecret, refreshToken),
    ]);
    return { accessToken, refreshToken };
  }
}

export const discordAuthProvider: Provider = {
  provide: SERVICES.DISCORD_AUTH,
  useClass: DiscordAuthService,
};
