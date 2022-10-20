import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { userProvider } from './user.service';

@Module({
  imports: [PrismaModule],
  providers: [userProvider],
  exports: [userProvider],
})
export class UserModule {}
