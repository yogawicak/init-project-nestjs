import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileDto } from './dto/upload.file.dto';
import { FileService } from './file.service';

@Controller('/service/file')
// @UseInterceptors(TransformInterceptor)
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  async upload(@Body() uploadFileDto: UploadFileDto) {
    try {
      const { image_path, hashedFileName }: any =
        await this.fileService.uploadImageDO(
          uploadFileDto.image,
          uploadFileDto.pathFolderImage,
        );

      return {
        status: true,
        message: 'Success Upload Image',
        result: { image_path, hashedFileName },
      };
      // console.log(uploaded_image);
    } catch (error) {
      // console.log(error);
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
