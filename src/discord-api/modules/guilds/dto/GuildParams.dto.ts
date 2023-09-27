import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const GuildParams = z.object({
  guildId: z.string(),
});

export class GuildParamsDto extends createZodDto(GuildParams) {}
