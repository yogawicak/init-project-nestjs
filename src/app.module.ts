import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { PaymentModule } from './payment/payment.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { FirebaseModule } from 'nestjs-firebase';
import { BannerModule } from './banner/banner.module';
import { HelpCenterModule } from './help_center/help_center.module';

@Module({
  imports: [
    UserModule,
    PropertyModule,
    PaymentModule,
    ReservationModule,
    AuthModule,
    PrismaModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          genReqId: (req) => {
            req.id = uuid();

            return req.id;
          },
          transport:
            configService.get('ENV_MACHINE') === 'local'
              ? {
                  target: 'pino-pretty',
                }
              : undefined,
          customLogLevel: (res, err) => {
            if (res.statusCode >= 400 && res.statusCode < 500) {
              return 'warn';
            }
          },
          serializers: {
            err: (err) => ({
              ...err,
            }),
          },
        },
      }),
    }),
    ConfigModule.forRoot(),
    EmailModule,
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        googleApplicationCredential: configService.get(
          'FIREBASE_SERVICE_ACCOUNT_FILENAME',
        ),
      }),
    }),
    BannerModule,
    HelpCenterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
