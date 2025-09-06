import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  transaction: string;

  @IsNotEmpty()
  @IsString()
  createdWallet: string;
}