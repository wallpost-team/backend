import { Inject, Provider } from '@nestjs/common';
import { ISocialProviderAuthService } from 'src/auth/modules/social-providers/services/auth.service.interface';
import { SocialProviderProfileService } from 'src/auth/modules/social-providers/services/profile.service';
import { SERVICES } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class VkProfileService extends SocialProviderProfileService {
  constructor(
    @Inject(SERVICES.VK_AUTH) auth: ISocialProviderAuthService,
    prisma: PrismaService,
  ) {
    super(auth, prisma);
  }
}

export const vkProfileProvider: Provider = {
  provide: SERVICES.VK_PROFILE,
  useClass: VkProfileService,
};
