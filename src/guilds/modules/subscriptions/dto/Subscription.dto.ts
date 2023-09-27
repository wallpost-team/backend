import { APIChannel, APIUser } from '@discordjs/core';
import { z } from 'nestjs-zod/z';
import { Wall } from 'src/vk-api/entities';

export interface ISubscription {
  id: string;
  wall: z.infer<typeof Wall>;
  channel: APIChannel;
  user: APIUser;
  createdAt: Date;
}
