import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards';
import { CreateSubscriptionBodyDto } from './dto';
import { ISubscriptionsService } from './subscriptions.interface';
import { GetUser, SERVICES } from 'src/common';
import { User } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(AccessTokenGuard)
export class SubscriptionsController {
  constructor(
    @Inject(SERVICES.SUBSCRIPTIONS)
    private readonly subscriptions: ISubscriptionsService,
  ) {}

  @Post()
  create(
    @Param('guildId') guildId: string,
    @Body() data: CreateSubscriptionBodyDto,
    @GetUser() user: User,
  ) {
    return this.subscriptions.create(guildId, data, user);
  }

  @Get()
  list(@Param('guildId') guildId: string) {
    return this.subscriptions.list(guildId);
  }

  @Get(':subscriptionId')
  get(
    @Param('guildId') guildId: string,
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.subscriptions.read(guildId, subscriptionId);
  }
}
