import { Prisma, UserSocialProviderProfile } from '@prisma/client';
import { AccessToken } from 'simple-oauth2';

export interface ISocialProviderProfileService {
  save(
    userId: number,
    profile: Omit<
      Prisma.UserSocialProviderProfileCreateWithoutUserInput,
      'tokenDetails'
    >,
    tokenDetails: AccessToken,
  ): Promise<UserSocialProviderProfile>;

  validate(
    where: Prisma.UserSocialProviderProfileUserIdProviderCompoundUniqueInput,
  ): Promise<UserSocialProviderProfile>;

  delete(
    where: Prisma.UserSocialProviderProfileUserIdProviderCompoundUniqueInput,
  ): Promise<UserSocialProviderProfile>;
}
