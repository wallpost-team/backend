import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Response } from 'express';
import { nanoid } from 'nanoid';
import { AccessToken, AuthorizationCode } from 'simple-oauth2';
import appConfig from 'src/app.config';
import { EncryptionService } from 'src/encryption/encryption.service';
import { ISocialProviderAuthService } from './auth.service.interface';
import { SocialProvider, User } from '@prisma/client';
import { ISocialProviderProfileService } from './profile.service.interface';

export abstract class AbstractSocialProviderAuthService
  implements ISocialProviderAuthService
{
  protected abstract readonly client: AuthorizationCode;

  constructor(
    private readonly encryption: EncryptionService,
    private readonly appConf: ConfigType<typeof appConfig>,
    private readonly profile: ISocialProviderProfileService,
  ) {}

  protected abstract socialProviderName: string;

  private get baseUri(): string {
    return `${this.appConf.host}:${this.appConf.port}/api/auth/social-providers/${this.socialProviderName}`;
  }

  private get authStateCookieName() {
    const socialProviderNameCapitalized =
      this.socialProviderName.charAt(0).toUpperCase() +
      this.socialProviderName.slice(1);
    return `${socialProviderNameCapitalized}AuthState`;
  }

  protected abstract scope: string[];

  getAuthorizationUri(response: Response) {
    const state = nanoid();

    response.cookie(this.authStateCookieName, state, {
      maxAge: 1000 * 60 * 5,
      signed: true,
    });

    const authorizationUri = this.client.authorizeURL({
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state,
    });

    return this.postGetAuthorizationUri(authorizationUri);
  }

  protected postGetAuthorizationUri(authorizationUri: string): string {
    return authorizationUri;
  }

  get redirectUri(): string {
    return `${this.baseUri}/callback`;
  }

  protected abstract provider: SocialProvider;

  async authenticate(query: object, cookies: object, user: User) {
    const code = this.validateCallback(query, cookies);
    const tokenDetails = await this.getToken(code);
    const userId = await this.getUserId(tokenDetails);
    return this.profile.save(
      user.id,
      { provider: this.provider, providerId: userId },
      tokenDetails,
    );
  }

  protected abstract getUserId(tokenDetails: AccessToken): Promise<number>;

  get okayUri(): string {
    return `${this.baseUri}/okay`;
  }

  protected abstract readonly encryptionSecret: Buffer;

  encryptTokenDetails(tokenDetails: AccessToken) {
    return this.encryption.encrypt(
      this.encryptionSecret,
      JSON.stringify(tokenDetails),
    );
  }

  async decryptTokenDetails(tokenDetails: string) {
    return this.client.createToken(
      JSON.parse(
        await this.encryption.decrypt(this.encryptionSecret, tokenDetails),
      ),
    );
  }

  protected validateCallback(query: any, cookies: any) {
    if (!query.code || !query.state || !cookies[this.authStateCookieName]) {
      throw new ForbiddenException();
    }
    if (query.state !== cookies[this.authStateCookieName]) {
      throw new ForbiddenException('State mismatch');
    }
    return query.code;
  }

  protected async getToken(code: string) {
    try {
      return await this.client.getToken({
        code,
        redirect_uri: this.redirectUri,
      });
    } catch (err) {
      console.error(err);
      throw new UnprocessableEntityException(
        `Could not authenticate ${this.socialProviderName} user.`,
      );
    }
  }

  async logout(user: User) {
    await this.profile.delete({ userId: user.id, provider: this.provider });
  }
}
