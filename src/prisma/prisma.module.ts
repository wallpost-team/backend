import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import prismaConfig from './prisma.config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forFeature(prismaConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
