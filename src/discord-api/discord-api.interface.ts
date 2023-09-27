import { API } from '@discordjs/core';
import { DiscordProfile } from '@prisma/client';

export interface IDiscordApiService {
  getApi1(profile?: DiscordProfile): Promise<API>;
}
