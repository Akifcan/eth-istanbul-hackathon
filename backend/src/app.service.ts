import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { RegisterSellerDto } from './dtos/register-seller.dto';
import { LoginSellerDto } from './dtos/login-seller.dto';
import { PurchaseDto } from './dtos/purchase.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { Shipping } from './dtos/shipping.entity';
import { Seller } from './entities/seller.entity';
import { Offers } from './entities/offers.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Offers)
    private offersRepository: Repository<Offers>,
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

  async loginSeller(loginSellerDto: LoginSellerDto): Promise<Seller> {
    const { email, password } = loginSellerDto;
    
    // Find seller by email
    const seller = await this.sellerRepository.findOne({
      where: { email }
    });

    if (!seller) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Return seller without password
    const { password: _, ...sellerWithoutPassword } = seller;
    return sellerWithoutPassword as Seller;
  }

  async createPurchase(purchaseDto: PurchaseDto): Promise<Shipping> {
    // Save to shipping repository only
    const shipping = this.shippingRepository.create({
      name: purchaseDto.name,
      address: purchaseDto.address,
      phoneNumber: purchaseDto.phoneNumber,
      campaignTransactionId: purchaseDto.contractId,
      walletAddress: purchaseDto.walletAddress
    });
    
    return await this.shippingRepository.save(shipping);
  }

  async createOffer(createOfferDto: CreateOfferDto): Promise<Offers> {
    const offer = this.offersRepository.create({
      contract: createOfferDto.transactionId,
      wallet: createOfferDto.wallet
    });
    
    return await this.offersRepository.save(offer);
  }
}
