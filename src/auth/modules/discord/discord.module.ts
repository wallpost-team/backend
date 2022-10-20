import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

import discordConfig from './discord.config';
import { DiscordController } from './discord.controller';
import { discordProvider } from './discord.service';
import { DiscordStrategy } from './discord.strategy';

@Module({
  imports: [
    UserModule,
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(discordConfig),
  ],
  controllers: [DiscordController],
  providers: [DiscordStrategy, discordProvider],
})
export class DiscordModule {}
