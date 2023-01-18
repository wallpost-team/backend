import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Provider,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AccessToken, AuthorizationCode } from 'simple-oauth2';
import { Response } from 'express';
import { nanoid } from 'nanoid';
import { RESTGetAPICurrentUserResult } from 'discord-api-types/v10';

import appConfig from 'src/app.config';
import { SERVICES } from 'src/common';
import { EncryptionService } from 'src/encryption/encryption.service';

import {
  IDiscordAuthCallbackCookies,
  IDiscordAuthCallbackQuery,
} from './types';
import discordAuthConfig from '../../discordAuth.config';
import { IDiscordAuthService } from './auth.service.interface';
import { IDiscordProfileService } from '../profile/profile.service.interface';
import { IDiscordApiClientService } from 'src/discord-api/services/client/client.service.interface';
import { UserRequestOptions } from 'src/discord-api/services/utils';

@Injectable()
export class DiscordAuthService implements IDiscordAuthService {
  constructor(
    @Inject(discordAuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof discordAuthConfig>,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>,
    @Inject(SERVICES.DISCORD_API_CLIENT)
    private readonly discordApiClient: IDiscordApiClientService,
    @Inject(forwardRef(() => SERVICES.DISCORD_PROFILE))
    private readonly discordProfile: IDiscordProfileService,
    private readonly encryption: EncryptionService,
  ) {}

  private readonly client = new AuthorizationCode({
    client: {
      id: this.authConfig.clientID,
      secret: this.authConfig.clientSecret,
    },
    auth: {
      tokenHost: 'https://discord.com',
      tokenPath: '/api/oauth2/token',
      revokePath: '/api/oauth2/token/revoke',
      authorizePath: '/oauth2/authorize',
    },
  });

  private readonly redirectUri = `${this.appConf.host}:${this.appConf.port}/api/auth/discord/callback`;

  getAuthorizationUri(response: Response) {
    const redirect_uri = `${this.appConf.host}:${this.appConf.port}/api/auth/discord/callback`;
    const state = nanoid();

    response.cookie('DiscordAuthState', state, {
      maxAge: 1000 * 60 * 5,
      signed: true,
    });

    return this.client.authorizeURL({
      redirect_uri,
      scope: ['identify', 'guilds'],
      state,
    });
  }

  async authenticate(
    query: IDiscordAuthCallbackQuery,
    cookies: IDiscordAuthCallbackCookies,
  ) {
    const code = this.validateCallback(query, cookies.DiscordAuthState);
    const tokenDetails = await this.getToken(code);

    const discordUser = await this.getDiscordUser(tokenDetails);
    return this.discordProfile.save(discordUser.id, tokenDetails);
  }

  async refresh(tokenDetails: AccessToken) {
    const refreshedTokenDetails = await this.refreshToken(tokenDetails);

    const discordUser = await this.getDiscordUser(refreshedTokenDetails);
    await this.discordProfile.save(discordUser.id, refreshedTokenDetails);
    return refreshedTokenDetails;
  }

  encryptTokenDetails(tokenDetails: AccessToken) {
    return this.encryption.encrypt(
      this.authConfig.encryptionSecret,
      JSON.stringify(tokenDetails),
    );
  }

  async decryptTokenDetails(tokenDetails: string) {
    return this.client.createToken(
      JSON.parse(
        await this.encryption.decrypt(
          this.authConfig.encryptionSecret,
          tokenDetails,
        ),
      ),
    );
  }

  private validateCallback(
    query: IDiscordAuthCallbackQuery,
    authStateCookie?: string,
  ) {
    if (!query.code || !query.state) {
      throw new ForbiddenException();
    }
    if (!(query.state === authStateCookie)) {
      throw new ForbiddenException('State mismatch');
    }
    return query.code;
  }

  private async getToken(code: string) {
    try {
      return await this.client.getToken({
        code,
        redirect_uri: this.redirectUri,
      });
    } catch (err) {
      console.error('Error getting Discord token details', err);
      throw new UnprocessableEntityException(
        'Could not authenticate Discord user.',
      );
    }
  }

  private getDiscordUser(tokenDetails: AccessToken) {
    return this.discordApiClient.rest.get(
      this.discordApiClient.Routes.user(),
      UserRequestOptions(tokenDetails),
    ) as Promise<RESTGetAPICurrentUserResult>;
  }

  private async refreshToken(tokenDetails: AccessToken) {
    try {
      return await tokenDetails.refresh();
    } catch (err) {
      console.error('Error refreshing Discord token details', err);
      throw new UnprocessableEntityException(
        'Could not refresh Discord tokens.',
      );
    }
  }
}

export const discordAuthProvider: Provider = {
  provide: SERVICES.DISCORD_AUTH,
  useClass: DiscordAuthService,
};
