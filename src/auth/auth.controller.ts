import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SuccessResponseData } from 'src/common/success.response.data';
import { AuthService } from './auth.service';
import { LoginAdminDto, LoginGoogleDto } from './dto/login.dto';
import { NewPasswordDto } from './dto/new.password.dto';
import {
  LoginManualDto,
  RegisterGoogleDto,
  RegisterManualDto,
} from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { VerifyEmailDto } from './dto/verify.email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(SuccessResponseData)
  public async registerConsumer(@Body() dto: RegisterManualDto) {
    await this.authService.registerManualConsumer(dto);
    return {
      message: 'Email Verification Has Send',
    };
  }

  @Post('/register/google')
  @UseInterceptors(SuccessResponseData)
  public async registerGoogleConsumer(@Body() dto: RegisterGoogleDto) {
    const result = await this.authService.registerGoogleConsumer(dto);
    return {
      result,
      message: 'Register Using Google Successfully',
    };
  }
  @Post('/login')
  @UseInterceptors(SuccessResponseData)
  public async loginGoogleConsumer(@Body() dto: LoginManualDto) {
    const result = await this.authService.loginManualConsumer(dto);
    return {
      result,
      message: 'Login Successfully',
    };
  }

  @Post('/login/google')
  @UseInterceptors(SuccessResponseData)
  public async loginConsumer(@Body() dto: LoginGoogleDto) {
    const result = await this.authService.loginGoogleConsumer(dto);
    return {
      result,
      message: 'Login Using Google Successfully',
    };
  }

  @Post('/verify')
  @UseInterceptors(SuccessResponseData)
  public async verifyCode(@Body() dto: VerifyEmailDto) {
    const result = await this.authService.vefifyCodeEmail(dto);
    return {
      result,
      message: 'Success Verify Email',
    };
  }

  /**
   * code confirmation
   */
  @Post('/request_reset_password')
  @UseInterceptors(SuccessResponseData)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.requestResetPassword(dto);
    return {
      result,
      message: 'Success Request Reset Password',
    };
  }

  @Post('/new_password')
  @UseInterceptors(SuccessResponseData)
  public async newPassword(@Body() dto: NewPasswordDto) {
    const result: any = await this.authService.newPassword(dto);
    return {
      ...(result.message ? {} : result),
      message: result.message ?? 'Success Change New Password',
    };
  }

  @Post('/admin/login')
  @UseInterceptors(SuccessResponseData)
  public async loginAdmin(@Body() dto: LoginAdminDto) {
    return {
      result: await this.authService.adminLogin(dto),
      message: 'Success Login Admin',
    };
  }
}
