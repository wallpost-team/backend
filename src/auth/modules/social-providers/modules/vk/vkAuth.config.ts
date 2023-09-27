/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';

export default registerAs('vkAuth', () => ({
  clientID: process.env.VK_AUTH_CLIENT_ID!,
  clientSecret: process.env.VK_AUTH_CLIENT_SECRET!,
  encryptionSecret: Buffer.from(process.env.VK_AUTH_ENCRYPTION_SECRET!),
}));
