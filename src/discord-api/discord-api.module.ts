import { Module } from '@nestjs/common';
import { DiscordApiGuildsModule, DiscordApiUsersModule } from './modules';
import { RouterModule } from '@nestjs/core';
import { routes as guildsRoutes } from './modules/guilds/guilds.routes';
import { routes as usersRoutes } from './modules/users/users.routes';
import { discordApiProvider } from './discord-api.service';
import { DiscordAuthModule } from 'src/auth/modules';
import discordApiConfig from './discord-api.config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    DiscordAuthModule,
    ConfigModule.forFeature(discordApiConfig),
    DiscordApiGuildsModule,
    DiscordApiUsersModule,
    RouterModule.register([
      {
        path: 'discord',
        children: [guildsRoutes, usersRoutes],
      },
    ]),
  ],
  providers: [discordApiProvider],
  exports: [discordApiProvider],
})
export class DiscordApiModule {}
