import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoSpacesServicerovider } from './digital_ocean';

@Module({
  imports: [
    ConfigModule,
    // MinioModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => {
    //     // console.log(config.get('SSL_MINIO'));

    //     return {
    //       accessKey: config.get('ACCESS_KEY'),
    //       endPoint: config.get('ENDPOINT_MINIO'),
    //       // port: parseInt(config.get('PORT_MINIO')),
    //       secretKey: config.get('SECRET_KEY'),
    //       useSSL: config.get('SSL_MINIO') === 'true' ? true : false,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),

    // MinioModule.register(config),
  ],
  providers: [FileService, DoSpacesServicerovider],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
