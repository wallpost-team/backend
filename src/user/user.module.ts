import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { userProvider } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [userProvider],
  exports: [userProvider],
  controllers: [UserController],
})
export class UserModule {}
