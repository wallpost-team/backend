/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';

export default registerAs('discordApi', () => ({
  token: process.env.DISCORD_API_TOKEN!,
}));
