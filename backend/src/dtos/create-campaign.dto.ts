import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  transaction: string;

  @IsNotEmpty()
  @IsString()
  createdWallet: string;

  @IsNotEmpty()
  @IsString()
  contractTitle: string;

  @IsNotEmpty()
  @IsString()
  contractDescription: string;
}