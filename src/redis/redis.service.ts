import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'redis-om';

import redisConfig from './redis.config';

@Injectable()
export class RedisService extends Client implements OnModuleDestroy {
  constructor(
    @Inject(redisConfig.KEY)
    private readonly config: ConfigType<typeof redisConfig>,
  ) {
    super();

    this.open(this.config.url);
  }

  async onModuleDestroy() {
    await this.close();
  }
}
