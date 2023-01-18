import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guards';
import { GetUser } from 'src/common';

@Controller('user')
export class UserController {
  @Get()
  @UseGuards(AccessTokenGuard)
  getUser(@GetUser() user: User) {
    return user;
  }
}
