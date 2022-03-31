import { BannerCategory } from '.prisma/client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    private prismaService: PrismaService,
    private fileService: FileService,
  ) {}

  private readonly logger = new Logger(BannerService.name);

  async create(dto: CreateBannerDto) {
    const { urlPath: imageName }: any = await this.fileService
      .uploadImageDO(dto.banner_image, 'banner_image')
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err);
      });
    dto.banner_image = imageName;

    return await this.prismaService.banner.create({ data: dto });
  }

  findAll() {
    return `This action returns all banner`;
  }

  async findByCategory(banner_category: BannerCategory) {
    return await this.prismaService.banner.findMany({
      where: {
        banner_category,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  async update(id: string, dto: UpdateBannerDto) {
    if (dto.banner_image)
      this.fileService
        .uploadImageDO(dto.banner_image, 'banner_image')
        .then(({ urlPath: imageName }) => {
          dto.banner_image = imageName;
        })
        .catch((err) => {
          this.logger.error(err);
          throw new BadRequestException(err);
        });

    return await this.prismaService.banner.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.banner.delete({
      where: {
        id,
      },
    });
  }
}
