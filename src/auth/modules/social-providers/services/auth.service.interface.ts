import { User, UserSocialProviderProfile } from '@prisma/client';
import { Response } from 'express';
import { AccessToken } from 'simple-oauth2';

export interface ISocialProviderAuthService {
  getAuthorizationUri(response: Response): string;
  redirectUri: string;
  okayUri: string;

  authenticate(
    query: object,
    cookies: object,
    user: User,
  ): Promise<UserSocialProviderProfile>;

  encryptTokenDetails(tokenDetails: AccessToken): Promise<string>;
  decryptTokenDetails(tokenDetails: string): Promise<AccessToken>;

  logout(user: User): Promise<void>;
}
