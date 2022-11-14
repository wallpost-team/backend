/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtAccessSecret: process.env.AUTH_JWT_ACCESS_SECRET!,
  jwtAccessTTL: Number(process.env.AUTH_JWT_ACCESS_TTL!),
  jwtRefreshSecret: process.env.AUTH_JWT_REFRESH_SECRET!,
  jwtRefreshTTL: Number(process.env.AUTH_JWT_REFRESH_TTL!),
}));
