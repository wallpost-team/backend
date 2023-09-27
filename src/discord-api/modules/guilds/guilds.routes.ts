import { RouteTree } from '@nestjs/core';
import { DiscordApiGuildsModule } from './guilds.module';
import { DiscordApiGuildsChannelsModule } from './modules';

export const routes: RouteTree = {
  path: 'guilds',
  module: DiscordApiGuildsModule,
  children: [
    {
      path: ':guildId',
      children: [DiscordApiGuildsChannelsModule],
    },
  ],
};
