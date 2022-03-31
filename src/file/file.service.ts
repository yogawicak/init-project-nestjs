import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { DoSpacesServiceLib } from './digital_ocean';

interface sample {
  [key: string]: any;
}

@Injectable()
export class FileService {
  // private readonly logger = new CostumLogger(FileService.name);

  constructor(
    // private readonly minio: MinioService,
    private configService: ConfigService,
    @Inject(DoSpacesServiceLib) private readonly s3: AWS.S3,
  ) {}

  // private get client() {
  //   return this.minio.client;
  // }

  public async uploadImageDO(base64image: string, folderPath: string) {
    return new Promise((resolve, reject) => {
      const bufferImage = Buffer.from(base64image, 'base64');
      const temp_filename = Date.now().toString();
      const hashedFileName = crypto
        .createHash('md5')
        .update(temp_filename)
        .digest('hex');
      const filename = folderPath + '/' + hashedFileName + '.jpg';
      const urlPath =
        'https://' +
        this.configService.get('ENDPOINT_SPACE_DO') +
        '/' +
        this.configService.get('SPACE_NAME') +
        '/' +
        filename;
      console.log(urlPath);

      const metaData = {
        'Content-Type': 'image/jpg',
      };

      this.s3.putObject(
        {
          Bucket: this.configService.get('SPACE_NAME'),
          Key: filename,
          Body: bufferImage,
          ACL: 'public-read',
          Metadata: metaData,
        },
        (err, data) => {
          if (err) {
            // this.logger.error(err.message, err.stack);
            console.log(err);

            reject(new Error(err.message));
          }

          resolve({
            image_path: filename,
            urlPath,
            hashedFileName: `${hashedFileName}.jpg`,
          });
        },
      );
    });
  }

  // public async uploadImage(base64image: string, folderPath: string) {
  //   return new Promise((resolve, reject) => {
  //     // this.logger.log('Upload file');
  //     const bufferImage = Buffer.from(base64image, 'base64');
  //     const temp_filename = Date.now().toString();
  //     const hashedFileName = crypto
  //       .createHash('md5')
  //       .update(temp_filename)
  //       .digest('hex');
  //     const filename = folderPath + '/' + hashedFileName + '.jpg';
  //     const urlPath =
  //       'https://' +
  //       this.configService.get('ENDPOINT_MINIO') +
  //       '/' +
  //       this.configService.get('BASE_BUCKET') +
  //       '/' +
  //       filename;
  //     console.log(urlPath);

  //     const metaData = {
  //       'Content-Type': 'image/jpg',
  //     };
  //     // console.log(
  //     //   hashedFileName,
  //     //   bufferImage,
  //     //   this.configService.get('BASE_BUCKET'),
  //     //   filename,
  //     // );

  //     this.client.putObject(
  //       this.configService.get('BASE_BUCKET'),
  //       filename,
  //       bufferImage,
  //       undefined,
  //       metaData,
  //       (err, res) => {
  //         if (err) {
  //           // this.logger.error(err.message, err.stack);
  //           console.log(err);

  //           reject(new Error(err.message));
  //         }
  //         // this.logger.log(`Success Upload Image`);
  //         console.log(res);

  //         resolve({
  //           image_path: filename,
  //           urlPath,
  //           hashedFileName: `${hashedFileName}.jpg`,
  //         });
  //       },
  //     );
  //   });

  //   // return {
  //   //   url: 'warga',
  //   // };
  // }
}
