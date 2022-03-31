import { BannerCategory } from '.prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Banner } from '../entities/banner.entity';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  banner_name: string;

  @IsNotEmpty()
  @IsEnum(BannerCategory)
  banner_category: BannerCategory;

  @IsNotEmpty()
  @IsBoolean()
  banner_status: boolean;

  @IsNotEmpty()
  @IsString()
  banner_image: string;
}
