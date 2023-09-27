export interface IUser {
  id: number;
  photo_200: string;
  track_code: string;
  screen_name: string;
  first_name: string;
  last_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
}

export type UsersGetResponse = IUser[];

export interface IUsersSearch {
  count: number;
  items: IUser[];
}

export type UsersSearchResponse = IUsersSearch;
