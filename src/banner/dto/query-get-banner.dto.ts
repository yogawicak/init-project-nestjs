import { BannerCategory } from '.prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Banner } from '../entities/banner.entity';

export class QueryBannerDto {
  @IsNotEmpty()
  @IsEnum(BannerCategory)
  banner_category: BannerCategory;
}
