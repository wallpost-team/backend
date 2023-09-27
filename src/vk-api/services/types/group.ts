export interface IGroup {
  id: number;
  name: string;
  screen_name: string;
  is_closed: 0 | 1 | 2;
  type: 'group' | 'page' | 'event';
  photo_50: string;
  photo_100: string;
  photo_200: string;
}

export interface IGroupsSearch {
  count: number;
  items: IGroup[];
}

export type GroupsSearchResponse = IGroupsSearch;
