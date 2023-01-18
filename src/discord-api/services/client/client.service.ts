import { Inject, Injectable, Provider } from '@nestjs/common';
import { REST } from '@discordjs/rest';
import { ConfigType } from '@nestjs/config';
import { Routes } from 'discord-api-types/v10';

import { SERVICES } from 'src/common';

import { IDiscordApiClientService } from './client.service.interface';
import discordApiConfig from '../../discord-api.config';

@Injectable()
export class DiscordApiClientService implements IDiscordApiClientService {
  constructor(
    @Inject(discordApiConfig.KEY)
    private readonly config: ConfigType<typeof discordApiConfig>,
  ) {}

  readonly Routes: typeof Routes = Routes;

  readonly rest = new REST({ version: '10' }).setToken(this.config.token);
}

export const discordApiClientProvider: Provider = {
  provide: SERVICES.DISCORD_API_CLIENT,
  useClass: DiscordApiClientService,
};
