import { SocialProvider } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateSubscriptionBody = z.object({
  channelId: z.string(),
  wallId: z.number(),
  provider: z.nativeEnum(SocialProvider),
});

export class CreateSubscriptionBodyDto extends createZodDto(
  CreateSubscriptionBody,
) {}
