import argon2 from 'argon2';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { SERVICES } from 'src/common';

import { IUserService } from 'src/user/user.service.interface';
import { IAuthService } from 'src/auth/auth.service.interface';
import { SignedTokens } from 'src/auth/types';

import { IDiscordService } from './discord.service.interface';
import { UserDetails } from './types';

@Injectable()
export class DiscordService implements IDiscordService {
  constructor(
    @Inject(SERVICES.USER) private readonly user: IUserService,
    @Inject(SERVICES.AUTH) private readonly auth: IAuthService,
  ) {}

  async validateUser(details: UserDetails): Promise<User> {
    const hashedTokens = await this.hashTokens(
      details.discordAccessToken,
      details.discordRefreshToken,
    );
    const preparedData = { ...details, ...hashedTokens };
    return this.user.upsert(preparedData, preparedData, {
      discordId: preparedData.discordId,
    });
  }

  authenticate(user: User): Promise<SignedTokens> {
    return this.auth.authenticate(user);
  }

  private async hashTokens(
    discordAccessToken: string,
    discordRefreshToken: string,
  ) {
    [discordAccessToken, discordRefreshToken] = await Promise.all([
      argon2.hash(discordAccessToken),
      argon2.hash(discordRefreshToken),
    ]);
    return { discordAccessToken, discordRefreshToken };
  }
}

export const discordProvider = {
  provide: SERVICES.DISCORD_AUTH,
  useClass: DiscordService,
};
