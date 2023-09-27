import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import {
  SocialProvider,
  Subscription,
  User,
  UserSocialProviderProfile,
  Wall,
} from '@prisma/client';
import { SERVICES } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Wall as WallEntity } from 'src/vk-api/entities';
import { IVkApiService } from 'src/vk-api/services/vk-api.service.interface';
import { z } from 'zod';
import { CreateSubscriptionBodyDto } from './dto';
import { ISubscriptionsService } from './subscriptions.interface';
import { IDiscordApiService } from 'src/discord-api/discord-api.interface';
import { APIChannel, APIUser } from '@discordjs/core';

@Injectable()
export class SubscriptionsService implements ISubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SERVICES.VK_API) private readonly vkApi: IVkApiService,
    @Inject(SERVICES.DISCORD_API)
    private readonly discordApi: IDiscordApiService,
  ) {}

  private providerToService = {
    [SocialProvider.VKONTAKTE]: this.vkApi,
  };

  async create(guildId: string, data: CreateSubscriptionBodyDto, user: User) {
    const profile = await this.prisma.userSocialProviderProfile.findUnique({
      where: { userId_provider: { userId: user.id, provider: data.provider } },
    });

    if (!profile) {
      throw new BadRequestException(
        `You are not authenticated with ${data.provider}`,
      );
    }

    return this.prisma.subscription.create({
      data: {
        channel: {
          connectOrCreate: {
            where: { id: data.channelId },
            create: {
              id: data.channelId,
              guild: {
                connectOrCreate: {
                  where: { id: guildId },
                  create: { id: guildId },
                },
              },
            },
          },
        },
        wall: {
          connectOrCreate: {
            where: {
              providerWallId_provider: {
                provider: data.provider,
                providerWallId: data.wallId,
              },
            },
            create: { provider: data.provider, providerWallId: data.wallId },
          },
        },
        user: { connect: { id: user.id } },
      },
    });
  }
  async list(guildId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { channel: { guildId } },
      include: {
        wall: true,
        channel: true,
        user: { include: { socialProfiles: true, discordProfile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const users = subscriptions.reduce(
      (acc, subscription) => acc.add(subscription.user),
      new Set<(typeof subscriptions)[0]['user']>(),
    );

    const discordApi = await this.discordApi.getApi1();

    const discordUsersRequest = Promise.all(
      [...users].map((user) =>
        discordApi.users.get(user.discordProfile.discordId),
      ),
    );

    const channels = subscriptions.reduce(
      (acc, subscription) => acc.add(subscription.channel),
      new Set<(typeof subscriptions)[0]['channel']>(),
    );

    const discordChannelsRequest = Promise.all(
      [...channels].map((channel) => discordApi.channels.get(channel.id)),
    );

    const subscriptionsBySocialProfiles = subscriptions.reduce(
      (acc, subscription) => {
        const socialProvider = subscription.user.socialProfiles.find(
          (profile) => profile.provider === subscription.wall.provider,
        );
        const subscriptions = acc.get(socialProvider) || [];
        subscriptions.push(subscription);
        return acc.set(socialProvider, subscriptions);
      },
      new Map<UserSocialProviderProfile | undefined, typeof subscriptions>(),
    );

    const wallsRequest = Promise.all(
      [...subscriptionsBySocialProfiles].map(([socialProfile, subscriptions]) =>
        socialProfile
          ? this.providerToService[socialProfile.provider]
              .client(socialProfile)
              .then((client) =>
                client.listWalls(
                  subscriptions.map(
                    (subscription) => subscription.wall.providerWallId,
                  ),
                ),
              )
          : new Promise<z.infer<typeof WallEntity>[]>((resolve) =>
              resolve(
                subscriptions.map((subscription) =>
                  unresolvedWall(subscription),
                ),
              ),
            ),
      ),
    );

    const [discordUsers, discordChannels, walls] = await Promise.all([
      discordUsersRequest,
      discordChannelsRequest,
      wallsRequest.then((walls) => walls.flat()),
    ]);

    return subscriptions.map((subscription) => ({
      id: subscription.id,
      wall: walls.find(
        (wall) =>
          wall.id === subscription.wall.providerWallId &&
          wall.provider === subscription.wall.provider,
      ) as z.infer<typeof WallEntity>,
      channel: discordChannels.find(
        (channel) => channel.id === subscription.channel.id,
      ) as APIChannel,
      user: discordUsers.find(
        (user) => user.id === subscription.user.discordProfile.discordId,
      ) as APIUser,
      createdAt: subscription.createdAt,
    }));
  }

  async read(guildId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { AND: { channel: { guildId }, id: subscriptionId } },
      include: {
        user: { include: { socialProfiles: true, discordProfile: true } },
        channel: true,
        wall: true,
      },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const discordApi = await this.discordApi.getApi1();

    const socialProfile = subscription.user.socialProfiles.find(
      (profile) => profile.provider === subscription.wall.provider,
    );

    const [discordUser, discordChannel, wall] = await Promise.all([
      discordApi.users.get(subscription.user.discordProfile.discordId),
      discordApi.channels.get(subscription.channel.id),
      socialProfile
        ? this.providerToService[socialProfile.provider]
            .client(socialProfile)
            .then((client) => client.readWall(subscription.wall.providerWallId))
            .then((wall) => (wall ? wall : unresolvedWall(subscription)))
        : new Promise<z.infer<typeof WallEntity>>((resolve) =>
            resolve(unresolvedWall(subscription)),
          ),
    ]);

    return {
      id: subscription.id,
      wall: wall,
      channel: discordChannel,
      user: discordUser,
      createdAt: subscription.createdAt,
    };
  }
}

const unresolvedWall = (subscription: Subscription & { wall: Wall }) => ({
  id: subscription.wall.providerWallId,
  provider: subscription.wall.provider,
  name: 'unresolved',
  screenName: 'unresolved',
  avatarUrl: 'unresolved',
});

export const subscriptionsProvider: Provider = {
  provide: SERVICES.SUBSCRIPTIONS,
  useClass: SubscriptionsService,
};
