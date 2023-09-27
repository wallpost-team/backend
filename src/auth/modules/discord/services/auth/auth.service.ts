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
import { DiscordApi } from 'src/discord-api/discord-api.service';

@Injectable()
export class DiscordAuthService implements IDiscordAuthService {
  constructor(
    @Inject(discordAuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof discordAuthConfig>,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>,
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

  private readonly baseUri = `${this.appConf.host}:${this.appConf.port}/api/auth/discord`;

  private readonly redirectUri = `${this.baseUri}/callback`;

  getAuthorizationUri(response: Response) {
    const state = nanoid();

    response.cookie('DiscordAuthState', state, {
      maxAge: 1000 * 60 * 5,
      signed: true,
    });

    return this.client.authorizeURL({
      redirect_uri: this.redirectUri,
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

  getOkayUri(): string {
    return `${this.baseUri}/okay`;
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
    return new DiscordApi(tokenDetails.token.access_token).getUser();
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
