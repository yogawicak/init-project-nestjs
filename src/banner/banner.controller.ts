import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
  Put,
  HttpCode,
} from '@nestjs/common';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { SuccessResponseData } from 'src/common/success.response.data';
import { ROLE } from 'src/user/entities/user.role';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-get-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseInterceptors(SuccessResponseData)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles([ROLE.ADMIN])
  async create(@Body() createBannerDto: CreateBannerDto) {
    return {
      result: await this.bannerService.create(createBannerDto),
      message: 'Success Upload Banner Image',
    };
  }

  @Get()
  @UseInterceptors(SuccessResponseData)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles([ROLE.ADMIN])
  async findByCategory(@Query() query: QueryBannerDto) {
    return {
      result: await this.bannerService.findByCategory(query.banner_category),
    };
  }

  @Put(':id')
  @UseInterceptors(SuccessResponseData)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles([ROLE.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return {
      result: await this.bannerService.update(id, updateBannerDto),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseInterceptors(SuccessResponseData)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles([ROLE.ADMIN])
  async remove(@Param('id') id: string) {
    return {
      result: await this.bannerService.remove(id),
      message: 'Success Delete Banner',
    };
  }
}
