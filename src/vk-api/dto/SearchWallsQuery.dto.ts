import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SearchWallsQuery = z.object({
  q: z.string(),
});

export class SearchWallsQueryDto extends createZodDto(SearchWallsQuery) {}
