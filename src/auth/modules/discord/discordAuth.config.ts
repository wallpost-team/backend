/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';

export default registerAs('discordAuth', () => ({
  clientID: process.env.DISCORD_AUTH_CLIENT_ID!,
  clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET!,
  encryptionSecret: Buffer.from(process.env.DISCORD_AUTH_ENCRYPTION_SECRET!),
}));
