import { user_admin, user_consumer } from '.prisma/client';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HelperFunction } from 'src/shared/helper';
import { ROLE } from 'src/user/entities/user.role';
import { UserRepository } from 'src/user/user.repository';
import {
  LoginManualDto,
  RegisterGoogleDto,
  RegisterManualDto,
} from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify.email.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { NewPasswordDto } from './dto/new.password.dto';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { LoginAdminDto, LoginGoogleDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectFirebaseAdmin() private firebaseAdmin: FirebaseAdmin,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private signJwt(user: user_consumer | user_admin, role: ROLE) {
    return this.jwtService.sign({ user, role });
  }

  public async registerManualConsumer(dto: RegisterManualDto) {
    const userExist = await this.userRepository.findUserConsumerByEmail(
      dto.email,
    );
    if (userExist && userExist.is_verif_email === true) {
      throw new BadRequestException('User Has Exist');
    }

    // if (isVerifUser) {
    //   throw new BadRequestException('User Has Exist');
    // }

    const passwordEncrypt = await HelperFunction.PasswordEncrypt(dto.password);
    const randomDigitCode = HelperFunction.GenerateFourDigitNumber();

    //set to redis and send email
    await this.cacheManager.set(dto.email, randomDigitCode).then((value) => {
      this.logger.log(
        `Succes Set in Redis ${value}`,
        'Set Code Verif To Redis',
      );
    });

    await this.emailService.sendEmailSendInBlue(
      { email: 'kodegiridev@gmail.com' },
      [{ email: dto.email }],
      'ini helloo',
      'ini kode verifikasi ' + randomDigitCode, //for sample
    );

    //
    if (!userExist) {
      return await this.prismaService.user_consumer.create({
        data: {
          email: dto.email,
          fullname: dto.fullname,
          password: passwordEncrypt,
        },
        select: {
          email: true,
          fullname: true,
        },
      });
    }

    return;
    // return created;
  }

  public async loginManualConsumer(dto: LoginManualDto) {
    const user = await this.userRepository.findUserConsumerByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    if (!user.is_verif_email) {
      throw new BadRequestException('User Not Verified');
    }

    const passwordDecrypt = await HelperFunction.PasswordDecrypt(
      dto.password,
      user.password,
    );
    if (!passwordDecrypt) {
      throw new BadRequestException('Wrong Password');
    }

    return {
      token: this.signJwt(user, ROLE.CONSUMER),
    };
  }

  public async vefifyCodeEmail(dto: VerifyEmailDto) {
    const codeInCache = await this.cacheManager.get(dto.email);
    this.logger.log({ codeInCache }, 'Code In Cache');
    if (parseInt(dto.code) === codeInCache) {
      //update verify email
      await this.prismaService.user_consumer.update({
        where: {
          email: dto.email,
        },
        data: {
          is_verif_email: true,
        },
      });
      await this.cacheManager.del(dto.email);
    } else {
      throw new BadRequestException('Code does not match');
    }
  }

  public async requestResetPassword(dto: ResetPasswordDto) {
    const userExist = await this.userRepository.findUserConsumerByEmail(
      dto.email,
    );
    if (!userExist) {
      throw new BadRequestException('User Not Found');
    } else if (userExist && userExist.is_verif_email === false) {
      throw new BadRequestException('User Has Not Verified');
    }

    const randomDigitCode = HelperFunction.GenerateFourDigitNumber();
    //set to redis and send email
    await this.cacheManager.set(dto.email, randomDigitCode).then((value) => {
      this.logger.log(
        `Succes Set in Redis ${value}`,
        'Set Code Verif To Redis',
      );
    });

    await this.emailService.sendEmailSendInBlue(
      { email: 'kodegiridev@gmail.com' },
      [{ email: dto.email }],
      'ini helloo',
      'ini kode verifikasi ' + randomDigitCode, //for sample
    );
  }

  public async newPassword(dto: NewPasswordDto) {
    const codeInCache = await this.cacheManager.get(dto.email);
    this.logger.log({ codeInCache }, 'Code In Cache');
    if (parseInt(dto.code) === codeInCache) {
      //update verify email

      if (dto.new_password) {
        const updated = await this.prismaService.user_consumer.update({
          where: {
            email: dto.email,
          },
          data: {
            password: await HelperFunction.PasswordEncrypt(dto.new_password),
          },
        });
        await this.cacheManager.del(dto.email);

        return updated;
      }

      return {
        message: 'Success Verify Code',
      };
    } else {
      throw new BadRequestException('Code does not match');
    }
  }

  public async registerGoogleConsumer(dto: RegisterGoogleDto) {
    try {
      //verify token to firebase
      const userDecoded = await this.firebaseAdmin.auth
        .verifyIdToken(dto.firebase_token)
        .catch((err) => {
          this.logger.error({ err }, 'Error verify Token Firebase');
          throw new Error('Firebase Auth Error');
        });
      this.logger.log({ userDecoded }, 'User Decoded Firebase Token');

      // check if email in token has register or not, it must verify
      const user = await this.userRepository.findUserConsumerByEmail(
        userDecoded.email,
      );

      // if user has exist, just binding in table google_account_consumer
      if (user && user.is_verif_email === true) {
        await this.prismaService.google_account_consumer.create({
          data: {
            google_profile_name: userDecoded.name,
            google_user_id: userDecoded.uid,
            is_google_verify_email: userDecoded.email_verified,
            google_profile_photo: userDecoded.picture,
            user_consumer_id: user.id,
          },
        });
      }

      // else user not exist, create on table user_consumer
      const createUser = await this.prismaService.user_consumer.create({
        data: {
          email: userDecoded.email,
          fullname: userDecoded.name,
          profile_photo: userDecoded.picture,
          phone_number: userDecoded.phone_number,
          is_bind_google: true,
          google_account_consumer: {
            create: {
              google_profile_name: userDecoded.name,
              google_user_id: userDecoded.uid,
              is_google_verify_email: userDecoded.email_verified,
              google_profile_photo: userDecoded.picture,
            },
          },
        },
      });

      // return token sign

      return createUser;

      // else user has not exist
    } catch (err) {
      this.logger.error({ err }, 'Error in Catch');
      throw new BadRequestException(err);
    }
  }

  public async loginGoogleConsumer(dto: LoginGoogleDto) {
    const userDecoded = await this.firebaseAdmin.auth
      .verifyIdToken(dto.firebase_token)
      .catch((err) => {
        this.logger.error({ err }, 'Error verify Token Firebase');
        throw new Error('Firebase Auth Error');
      });
    this.logger.log({ userDecoded }, 'User Decoded Firebase Token');

    // check if email in token has register or not, it must verify
    const user = await this.userRepository.findUserConsumerByEmail(
      userDecoded.email,
    );

    // if user has not exist
    if (!user) {
      throw new BadRequestException('User Not Found, Register First');
    }

    return {
      token: this.signJwt(user, ROLE.CONSUMER),
    };
  }

  public async adminLogin(dto: LoginAdminDto) {
    const user = await this.userRepository.findUserAdminByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    if (!(await HelperFunction.PasswordDecrypt(dto.password, user.password))) {
      throw new BadRequestException('Wrong Password');
    }

    return {
      token: this.signJwt(user, ROLE.ADMIN),
    };
  }
}
