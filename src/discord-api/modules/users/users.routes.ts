import { RouteTree } from '@nestjs/core';
import { DiscordApiUsersModule } from './users.module';

export const routes: RouteTree = {
  path: 'users',
  module: DiscordApiUsersModule,
};
