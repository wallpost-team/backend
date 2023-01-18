import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

export interface IDiscordApiClientService {
  readonly Routes: typeof Routes;
  readonly rest: REST;
}
