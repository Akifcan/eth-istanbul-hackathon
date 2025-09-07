import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { RegisterSellerDto } from './dtos/register-seller.dto';
import { LoginSellerDto } from './dtos/login-seller.dto';
import { PurchaseDto } from './dtos/purchase.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { Campaign } from './entities/campaign.entity';
import { Seller } from './entities/seller.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('campaigns')
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.appService.createCampaign(createCampaignDto);
  }

  @Get('suggested-campaign')
  async suggestedCampaign(): Promise<Campaign | null> {
    return this.appService.getSuggestedCampaign();
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

  @Post('offer')
  async offer(@Body() createOfferDto: CreateOfferDto): Promise<any> {
    return this.appService.createOffer(createOfferDto);
  }

  @Get('campaigns')
  async getCampaigns(
    @Query('createdWallet') createdWallet?: string,
    @Query('limit') limit?: number
  ): Promise<Campaign[]> {
    if (createdWallet) {
      return this.appService.getCampaignsByCreatedWallet(createdWallet, limit);
    }
    return this.appService.getAllCampaigns(limit);
  }

    @Get('offers/:wallet')
    async offers(@Param('wallet') wallet: string): Promise<any> {
        return this.appService.getOffersByWallet(wallet);
    }

    @Get('seller/:id')
    async seller(@Param('id') id: string): Promise<Seller | null> {
        return this.appService.getSellerById(parseInt(id));
    }

}
