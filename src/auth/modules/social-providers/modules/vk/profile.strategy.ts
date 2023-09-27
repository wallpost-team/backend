import { AUTH_STRATEGIES, SERVICES } from 'src/common';
import { ProfileStrategy } from '../../profile.strategy';
import { SocialProvider } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import authConfig from 'src/auth/auth.config';
import { ConfigType } from '@nestjs/config';
import { SocialProviderProfileService } from 'src/auth/modules/social-providers/services/profile.service';

@Injectable()
export class VkProfileStrategy extends ProfileStrategy(
  AUTH_STRATEGIES.VK_PROFILE,
  SocialProvider.VKONTAKTE,
) {
  constructor(
    @Inject(authConfig.KEY) config: ConfigType<typeof authConfig>,
    @Inject(SERVICES.VK_PROFILE) profile: SocialProviderProfileService,
  ) {
    super(config, profile);
  }
}
