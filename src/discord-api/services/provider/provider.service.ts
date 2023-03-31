import { Inject, Injectable, Provider } from '@nestjs/common';
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
} from 'discord-api-types/v10';

import { SERVICES } from 'src/common';

import { IDiscordApiProviderService } from './provider.service.interface';
import { IDiscordApiClientService } from '../client/client.service.interface';
import { IDiscordAuthService } from 'src/auth/modules/discord/services/auth/auth.service.interface';
import { AccessToken } from 'simple-oauth2';
import { UserRequestOptions } from '../utils';

@Injectable()
export class DiscordApiProviderService implements IDiscordApiProviderService {
  constructor(
    @Inject(SERVICES.DISCORD_API_CLIENT)
    private readonly client: IDiscordApiClientService,
    @Inject(SERVICES.DISCORD_AUTH)
    private readonly discordAuth: IDiscordAuthService,
  ) {}

  async getUser(tokenDetails: string) {
    return this.client.rest.get(
      this.client.Routes.user(),
      await this.prepareUserRequestOptions(tokenDetails),
    ) as Promise<RESTGetAPICurrentUserResult>;
  }

  async getUserGuilds(tokenDetails: string) {
    return this.client.rest.get(
      this.client.Routes.userGuilds(),
      await this.prepareUserRequestOptions(tokenDetails),
    ) as Promise<RESTGetAPICurrentUserGuildsResult>;
  }

  getBotGuilds() {
    return this.client.rest.get(
      this.client.Routes.userGuilds(),
    ) as Promise<RESTGetAPICurrentUserGuildsResult>;
  }

  private async prepareUserRequestOptions(encryptedTokenDetails: string) {
    const tokenDetails = await this.discordAuth.decryptTokenDetails(
      encryptedTokenDetails,
    );
    return this.prepareUserRequestOptionsUnencrypted(tokenDetails);
  }

  private async prepareUserRequestOptionsUnencrypted(
    tokenDetails: AccessToken,
  ) {
    if (tokenDetails.expired()) {
      tokenDetails = await this.discordAuth.refresh(tokenDetails);
    }
    return UserRequestOptions(tokenDetails);
  }
}

export const discordApiProviderProvider: Provider = {
  provide: SERVICES.DISCORD_API_PROVIDER,
  useClass: DiscordApiProviderService,
};
