import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from 'src/common';

export class DiscordProfileGuard extends AuthGuard(
  AUTH_STRATEGIES.DISCORD_PROFILE,
) {}
