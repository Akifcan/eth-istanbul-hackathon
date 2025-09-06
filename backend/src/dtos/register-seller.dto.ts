import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterSellerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  wallet: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  photoUrl: string;
}