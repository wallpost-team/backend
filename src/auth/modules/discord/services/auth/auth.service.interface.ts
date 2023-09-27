import { Response } from 'express';
import { AccessToken } from 'simple-oauth2';
import { UserDiscordProfile } from '../types';
import {
  IDiscordAuthCallbackCookies,
  IDiscordAuthCallbackQuery,
} from './types';

export interface IDiscordAuthService {
  getAuthorizationUri(response: Response): string;

  authenticate(
    query: IDiscordAuthCallbackQuery,
    cookies: IDiscordAuthCallbackCookies,
  ): Promise<UserDiscordProfile>;
  refresh(tokenDetails: AccessToken): Promise<AccessToken>;

  getOkayUri(): string;

  encryptTokenDetails(tokenDetails: AccessToken): Promise<string>;
  decryptTokenDetails(tokenDetails: string): Promise<AccessToken>;
}
