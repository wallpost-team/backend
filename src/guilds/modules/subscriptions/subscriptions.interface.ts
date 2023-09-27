import { Subscription, User } from '@prisma/client';
import { CreateSubscriptionBodyDto, ISubscription } from './dto';

export interface ISubscriptionsService {
  create(
    guildId: string,
    data: CreateSubscriptionBodyDto,
    user: User,
  ): Promise<Subscription>;
  list(guildId: string): Promise<ISubscription[]>;
  read(guildId: string, subscriptionId: string): Promise<ISubscription>;
}
