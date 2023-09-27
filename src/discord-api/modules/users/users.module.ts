import { Module } from '@nestjs/common';
import { discordApiUsersProvider } from './users.service';
import { DiscordApiUsersController } from './users.controller';
import { DiscordAuthModule } from 'src/auth/modules';
import { ConfigModule } from '@nestjs/config';
import discordApiConfig from 'src/discord-api/discord-api.config';

@Module({
  imports: [DiscordAuthModule, ConfigModule.forFeature(discordApiConfig)],
  providers: [discordApiUsersProvider],
  controllers: [DiscordApiUsersController],
  exports: [discordApiUsersProvider],
})
export class DiscordApiUsersModule {}
