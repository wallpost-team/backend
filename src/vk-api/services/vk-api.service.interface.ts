import { UserSocialProviderProfile } from '@prisma/client';
import { User, Wall } from '../entities';
import { z } from 'zod';

export interface IVkClient {
  getUser(): Promise<z.infer<typeof User>>;
  searchWalls(
    q: string,
  ): Promise<{ users: z.infer<typeof Wall>[]; groups: z.infer<typeof Wall>[] }>;
  listWalls(wallIds: number[]): Promise<z.infer<typeof Wall>[]>;
  readWall(wallId: number): Promise<z.infer<typeof Wall> | undefined>;
}

export interface IVkApiService {
  client(profile: UserSocialProviderProfile): Promise<IVkClient>;
}
