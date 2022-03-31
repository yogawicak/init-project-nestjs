import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterManualDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterGoogleDto {
  @IsNotEmpty()
  @IsString()
  firebase_token: string;
}

export class LoginManualDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
