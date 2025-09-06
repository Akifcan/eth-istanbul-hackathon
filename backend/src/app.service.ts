import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dtos/create-campaign.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createCampaign(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.create(createCampaignDto);
    return await this.campaignRepository.save(campaign);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.campaignRepository.find();
  }

  async getCampaignsByCreatedWallet(createdWallet: string): Promise<Campaign[]> {
    return await this.campaignRepository.find({
      where: { createdWallet },
    });
  }
}
