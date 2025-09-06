import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { RegisterSellerDto } from './dtos/register-seller.dto';
import { LoginSellerDto } from './dtos/login-seller.dto';
import { PurchaseDto } from './dtos/purchase.dto';
import { Campaign } from './entities/campaign.entity';
import { Seller } from './entities/seller.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('campaigns')
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.appService.createCampaign(createCampaignDto);
  }

  @Post('register')
  async register(@Body() registerSellerDto: RegisterSellerDto): Promise<Seller> {
    return this.appService.registerSeller(registerSellerDto);
  }

  @Post('login')
  async login(@Body() loginSellerDto: LoginSellerDto): Promise<Seller> {
    return this.appService.loginSeller(loginSellerDto);
  }

  @Post('purchase')
  async purchase(@Body() purchaseDto: PurchaseDto): Promise<any> {
    return this.appService.createPurchase(purchaseDto);
  }

  @Get('campaigns')
  async getCampaigns(@Query('createdWallet') createdWallet?: string): Promise<Campaign[]> {
    if (createdWallet) {
      return this.appService.getCampaignsByCreatedWallet(createdWallet);
    }
    return this.appService.getAllCampaigns();
  }
}
