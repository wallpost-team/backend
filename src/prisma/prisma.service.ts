import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import prismaConfig from './prisma.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(prismaConfig.KEY)
    readonly config: ConfigType<typeof prismaConfig>,
  ) {
    super({
      datasources: {
        db: { url: config.url },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  exclude<Model, Key extends keyof Model>(
    obj: Model,
    ...keys: Key[]
  ): Omit<Model, Key> {
    for (const key of keys) {
      delete obj[key];
    }
    return obj;
  }
}
