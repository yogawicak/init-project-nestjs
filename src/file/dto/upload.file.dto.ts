import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsBase64()
  image: string;

  @IsNotEmpty()
  @IsString()
  pathFolderImage: string;
}
