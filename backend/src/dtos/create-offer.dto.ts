import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  wallet: string;

  @IsNotEmpty()
  sellerId: number
}