/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST!,
  port: process.env.APP_PORT!,
  cookieSecret: process.env.APP_COOKIE_SECRET!,
}));
