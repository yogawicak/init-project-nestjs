import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginManualDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginGoogleDto {
  @IsNotEmpty()
  @IsString()
  firebase_token: string;
}

export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
