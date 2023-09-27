import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guards';
import { GetUser, SERVICES } from 'src/common';
import { IUserService } from './user.service.interface';

@Controller('user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(@Inject(SERVICES.USER) private readonly user: IUserService) {}

  @Get()
  getUser(@GetUser() user: User) {
    return user;
  }

  @Get('profiles')
  getUserProfiles(@GetUser() user: User) {
    return this.user.listSocialProfiles(user);
  }
}
