import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { RegisterSellerDto } from './dtos/register-seller.dto';
import { Shipping } from './dtos/shipping.entity';
import { Seller } from './entities/seller.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async createCampaign(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignRepository.save(this.campaignRepository.create(createCampaignDto));
    await this.shippingRepository.save(this.shippingRepository.create({
        name: createCampaignDto.name,
        address: createCampaignDto.address,
        phoneNumber: createCampaignDto.phoneNumber,
        campaignTransactionId: campaign.transaction,
        walletAddress: campaign.createdWallet
    }))
    return campaign
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.campaignRepository.find();
  }

  async getCampaignsByCreatedWallet(createdWallet: string): Promise<Campaign[]> {
    return await this.campaignRepository.find({
      where: { createdWallet },
    });
  }

  async registerSeller(registerSellerDto: RegisterSellerDto): Promise<Seller> {
    const seller = this.sellerRepository.create(registerSellerDto);
    return await this.sellerRepository.save(seller);
  }
}
