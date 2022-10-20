/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  url: process.env.POSTGRES_URL!,
}));
