import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  imports: [PrismaModule, FileModule],
})
export class BannerModule {}
