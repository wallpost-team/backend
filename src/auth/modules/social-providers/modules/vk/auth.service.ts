import { forwardRef, Inject, Injectable, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SocialProvider, User } from '@prisma/client';
import { AccessToken, AuthorizationCode } from 'simple-oauth2';

import appConfig from 'src/app.config';
import { AbstractSocialProviderAuthService } from 'src/auth/modules/social-providers/services/auth.service';
import { ISocialProviderProfileService } from 'src/auth/modules/social-providers/services/profile.service.interface';
import { SERVICES } from 'src/common';
import { EncryptionService } from 'src/encryption/encryption.service';

import vkAuthConfig from './vkAuth.config';

@Injectable()
export class VkAuthService extends AbstractSocialProviderAuthService {
  constructor(
    @Inject(vkAuthConfig.KEY)
    private readonly authConf: ConfigType<typeof vkAuthConfig>,

    encryption: EncryptionService,
    @Inject(appConfig.KEY)
    appConf: ConfigType<typeof appConfig>,
    @Inject(forwardRef(() => SERVICES.VK_PROFILE))
    profile: ISocialProviderProfileService,
  ) {
    super(encryption, appConf, profile);
  }

  encryptionSecret = this.authConf.encryptionSecret;

  client = new AuthorizationCode({
    client: {
      id: this.authConf.clientID,
      secret: this.authConf.clientSecret,
    },
    auth: {
      tokenHost: 'https://oauth.vk.com',
      tokenPath: '/access_token',
      authorizePath: '/authorize',
    },
    options: { authorizationMethod: 'body' },
  });

  socialProviderName = 'vk';

  scope = ['offline'];

  provider = SocialProvider.VKONTAKTE;

  protected postGetAuthorizationUri(authorizationUri: string): string {
    const searchParams = new URLSearchParams({
      display: 'popup',
      v: '5.131',
    });
    return `${authorizationUri}&${searchParams}`;
  }

  async getUserId(tokenDetails: AccessToken): Promise<number> {
    return tokenDetails.token.user_id;
  }
}

export const vkAuthProvider: Provider = {
  provide: SERVICES.VK_AUTH,
  useClass: VkAuthService,
};
