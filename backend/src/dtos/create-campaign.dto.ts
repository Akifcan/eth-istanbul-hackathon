import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  transaction: string;

  @IsNotEmpty()
  @IsString()
  createdWallet: string;

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  address: string

  @IsNotEmpty()
  phoneNumber: string
}