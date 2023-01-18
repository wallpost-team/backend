import { DiscordProfile, User } from '@prisma/client';

export type UserDiscordProfile = DiscordProfile & { user: User };
