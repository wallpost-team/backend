import { Inject, Injectable, Provider } from '@nestjs/common';
import { IAPIOptions, VK } from 'vk-io';
import { IVkApiService, IVkClient } from './vk-api.service.interface';
import { UsersFields } from 'vk-io/lib/api/schemas/objects';
import {
  GroupsSearchResponse,
  IWall,
  IGroup,
  IUser,
  UsersSearchResponse,
  UsersGetResponse,
} from './types';
import { SERVICES } from 'src/common';
import { ISocialProviderAuthService } from 'src/auth/modules/social-providers/services/auth.service.interface';
import { SocialProvider, UserSocialProviderProfile } from '@prisma/client';
import { User, fromUserType, fromWallType } from '../entities';
import { z } from 'zod';

class VkClient implements IVkClient {
  client: VK;

  private readonly userFields: UsersFields[] = ['screen_name', 'photo_200'];

  constructor(token: string) {
    this.client = new VK({ token });
  }

  async getUser(): Promise<z.infer<typeof User>> {
    const getUsersResponse = (await this.client.api.users.get({
      fields: this.userFields,
    })) as UsersGetResponse;
    return fromUserType(getUsersResponse[0]);
  }

  async searchWalls(q: string) {
    const [users, groups] = await this.toggleApiMode(() =>
      Promise.all([this.searchUsers(q), this.searchGroups(q)]),
    );
    return {
      users: users.items.map(this.userToWall).map(fromWallType),
      groups: groups.items.map(this.groupToWall).map(fromWallType),
    };
  }

  async listWalls(wallIds: number[]) {
    const user_ids = wallIds.filter((wallId) => wallId > 0);
    const group_ids = wallIds
      .filter((wallId) => wallId < 0)
      .map((wallId) => Math.abs(wallId));

    const noData = new Promise<[]>((resolve) => resolve([]));

    const [users, groups] = await this.toggleApiMode(() =>
      Promise.all([
        user_ids.length
          ? this.client.api.users.get({ user_ids, fields: this.userFields })
          : noData,
        group_ids.length
          ? (this.client.api.groups.getById({
              group_ids,
            }) as unknown as Promise<IGroup[]>)
          : noData,
      ]),
    );

    return [...users.map(this.userToWall), ...groups.map(this.groupToWall)]
      .sort((a, b) => wallIds.indexOf(a.id) - wallIds.indexOf(b.id))
      .map(fromWallType);
  }

  readWall(wallId: number) {
    return this.listWalls([wallId]).then((walls) => walls[0]);
  }

  private searchGroups(q: string): Promise<GroupsSearchResponse> {
    return this.client.api.groups.search({
      q,
    }) as Promise<GroupsSearchResponse>;
  }

  private groupToWall(group: IGroup): IWall {
    return {
      id: -group.id,
      provider: SocialProvider.VKONTAKTE,
      name: group.name,
      screen_name: group.screen_name,
      photo_200: group.photo_200,
    };
  }

  private searchUsers(q: string): Promise<UsersSearchResponse> {
    return this.client.api.users.search({
      q,
      fields: this.userFields,
    }) as Promise<UsersSearchResponse>;
  }

  private userToWall(user: IUser): IWall {
    return {
      id: user.id,
      provider: SocialProvider.VKONTAKTE,
      name: `${user.first_name} ${user.last_name}`,
      screen_name: user.screen_name,
      photo_200: user.photo_200,
    };
  }

  private async toggleApiMode<T>(
    promise: () => Promise<T>,
    apiMode: IAPIOptions['apiMode'] = 'parallel',
  ): Promise<T> {
    const baseApiMode = this.client.api.options.apiMode;
    this.client.api.options.apiMode = apiMode;

    const result = await promise();

    this.client.api.options.apiMode = baseApiMode;

    return result;
  }
}

@Injectable()
export class VkApiService implements IVkApiService {
  constructor(
    @Inject(SERVICES.VK_AUTH) private readonly auth: ISocialProviderAuthService,
  ) {}

  async client(profile: UserSocialProviderProfile): Promise<VkClient> {
    const decryptedToken = await this.auth.decryptTokenDetails(
      profile.tokenDetails,
    );
    return new VkClient(decryptedToken.token.access_token);
  }
}

export const vkApiProvider: Provider = {
  provide: SERVICES.VK_API,
  useClass: VkApiService,
};
