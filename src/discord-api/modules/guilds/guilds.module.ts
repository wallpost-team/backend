import { Module } from '@nestjs/common';
import { discordApiGuildsProvider } from './guilds.service';
import { DiscordApiGuildsController } from './guilds.controller';
import { DiscordAuthModule } from 'src/auth/modules';
import { ConfigModule } from '@nestjs/config';
import discordApiConfig from 'src/discord-api/discord-api.config';
import { DiscordApiGuildsChannelsModule } from './modules';

@Module({
  imports: [
    DiscordAuthModule,
    ConfigModule.forFeature(discordApiConfig),
    DiscordApiGuildsChannelsModule,
  ],
  providers: [discordApiGuildsProvider],
  controllers: [DiscordApiGuildsController],
})
export class DiscordApiGuildsModule {}
