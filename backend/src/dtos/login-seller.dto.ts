import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginSellerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}