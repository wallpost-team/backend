import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DiscordProfile } from '@prisma/client';

export const GetDiscordProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as DiscordProfile;
  },
);
