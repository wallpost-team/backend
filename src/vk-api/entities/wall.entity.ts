import { z } from 'zod';
import { IWall } from '../services/types';
import { SocialProvider } from '@prisma/client';

export const Wall = z.object({
  id: z.number(),
  provider: z.nativeEnum(SocialProvider),
  name: z.string(),
  screenName: z.string(),
  avatarUrl: z.string().url(),
});

export const fromWallType = (wall: IWall) =>
  Wall.parse({
    id: wall.id,
    provider: wall.provider,
    name: wall.name,
    screenName: wall.screen_name,
    avatarUrl: wall.photo_200,
  });
