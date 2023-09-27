import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccessToken } from 'simple-oauth2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISocialProviderAuthService } from './auth.service.interface';
import { ISocialProviderProfileService } from './profile.service.interface';

export abstract class SocialProviderProfileService
  implements ISocialProviderProfileService
{
  constructor(
    private readonly auth: ISocialProviderAuthService,
    private readonly prisma: PrismaService,
  ) {}

  async save(
    userId: number,
    profile: Omit<
      Prisma.UserSocialProviderProfileCreateWithoutUserInput,
      'tokenDetails'
    >,
    tokenDetails: AccessToken,
  ) {
    const encryptedTokenDetails = await this.auth.encryptTokenDetails(
      tokenDetails,
    );

    const data = { ...profile, userId, tokenDetails: encryptedTokenDetails };

    return await this.prisma.userSocialProviderProfile.upsert({
      where: {
        userId_provider: { userId: data.userId, provider: data.provider },
      },
      create: data,
      update: data,
    });
  }

  async validate(
    where: Prisma.UserSocialProviderProfileUserIdProviderCompoundUniqueInput,
  ) {
    const userSocialProviderProfile =
      await this.prisma.userSocialProviderProfile.findUnique({
        where: { userId_provider: where },
      });
    if (!userSocialProviderProfile) {
      throw new NotFoundException('User social provider profile Not Found.');
    }
    return userSocialProviderProfile;
  }

  delete(
    where: Prisma.UserSocialProviderProfileUserIdProviderCompoundUniqueInput,
  ) {
    return this.prisma.userSocialProviderProfile.delete({
      where: { userId_provider: where },
    });
  }
}
