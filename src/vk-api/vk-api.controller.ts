import {
  Body,
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserSocialProviderProfile } from '@prisma/client';
import { VkProfileGuard } from 'src/auth/modules/social-providers/modules/vk/profile.guard';
import { GetUser, SERVICES } from 'src/common';
import { IVkApiService } from './services/vk-api.service.interface';
import { User } from './entities';
import { z } from 'zod';
import { SearchWallsQueryDto } from './dto';

@Controller('vk')
@UseGuards(VkProfileGuard)
export class VkApiController {
  constructor(@Inject(SERVICES.VK_API) private readonly api: IVkApiService) {}

  @Get('user')
  async getUser(
    @GetUser() profile: UserSocialProviderProfile,
  ): Promise<z.infer<typeof User>> {
    return (await this.api.client(profile)).getUser();
  }

  @Get('walls')
  async searchWalls(
    @GetUser() profile: UserSocialProviderProfile,
    @Query() searchWallsQuery: SearchWallsQueryDto,
  ) {
    return (await this.api.client(profile)).searchWalls(searchWallsQuery.q);
  }
}
