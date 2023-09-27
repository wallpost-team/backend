import { SocialProvider } from '@prisma/client';

export interface IWall {
  id: number;
  provider: SocialProvider;
  name: string;
  screen_name: string;
  photo_200: string;
}

export interface IWallsSearch {
  count: number;
  items: IWall[];
}

export type WallsSearchResponse = IWallsSearch;
