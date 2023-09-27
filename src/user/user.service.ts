import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Prisma, SocialProvider, User } from '@prisma/client';

import { SERVICES } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { IUserService } from './user.service.interface';
import { IVkApiService } from 'src/vk-api/services/vk-api.service.interface';
import { Wall } from 'src/vk-api/entities';
import { z } from 'nestjs-zod/z';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SERVICES.VK_API) private readonly vkApi: IVkApiService,
  ) {}

  async upsert(
    create: Prisma.UserCreateInput,
    update: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prisma.user.upsert({ create, update, where });
    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async get(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({ where });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async find(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where });
    if (!user) return null;
    return user;
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const user = await this.prisma.user.update({ where, data });
    return user;
  }

  private providerToService = {
    [SocialProvider.VKONTAKTE]: this.vkApi,
  };

  async listSocialProfiles(user: User) {
    const userSocialProviderProfiles =
      await this.prisma.userSocialProviderProfile.findMany({
        where: { userId: user.id },
      });

    const socialProfiles = await Promise.all(
      userSocialProviderProfiles.map(
        async (profile) =>
          (
            await this.providerToService[profile.provider].client(profile)
          ).readWall(profile.providerId) as Promise<z.infer<typeof Wall>>,
      ),
    );

    return socialProfiles;
  }
}

export const userProvider: Provider = {
  provide: SERVICES.USER,
  useClass: UserService,
};
