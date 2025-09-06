'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { ArrowRight, Users, Clock, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';

const { abi } = contractArtifact;

interface FeaturedDealCardProps {
  campaign: CampaignProps;
}

interface ContractInfo {
  currentParticipants: bigint;
  maxParticipants: bigint;
  contractEndDate: string;
  priceETH: string;
  contractTitle: string;
  contractDescription: string;
  senderCompany: string;
  isFinalized: boolean;
}

export default function FeaturedDealCard({ campaign }: FeaturedDealCardProps) {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  
  const getParticipantInfo = async () => {
    try {
      if (!window.ethereum || !campaign?.transaction) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(campaign.transaction, abi, provider);
      
      const result = await contract.getParticipantInfo();
      
      const info: ContractInfo = {
        currentParticipants: result[0],
        maxParticipants: result[1],
        contractEndDate: result[2].toString(),
        priceETH: result[3],
        contractTitle: result[4],
        contractDescription: result[5],
        senderCompany: result[6],
        isFinalized: result[7]
      };

      setContractInfo(info);
    } catch (error) {
      console.error('Error getting contract info:', error);
    }
  };

  useEffect(() => {
    if (campaign?.transaction) {
      getParticipantInfo();
    }
  }, [campaign?.transaction]);

  if (!contractInfo) {
    return (
      <div className="relative">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
            <div className="h-4 bg-gray-700/50 rounded w-12"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-2xl p-3">
                <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-3">
                <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-16 bg-gray-700/50 rounded-2xl"></div>
            <div className="h-2 bg-gray-700/50 rounded-full"></div>
            <div className="h-10 bg-gray-700/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const endDate = new Date(parseInt(contractInfo.contractEndDate) * 1000);
  const timeRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const participantProgress = (Number(contractInfo.currentParticipants) / Number(contractInfo.maxParticipants)) * 100;

  return (
    <div className="relative group">
      {/* Glowing background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
      
      <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 hover:border-pink-500/30 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3 h-3" />
            FEATURED
          </div>
          <div className="text-xs text-gray-400">
            {timeRemaining > 0 ? `${timeRemaining}d left` : 'Expired'}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold text-white leading-tight mb-2">
              {contractInfo.contractTitle || 'Premium Bulk Deal'}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {contractInfo.contractDescription || 'Join this exclusive bulk purchase and save money together!'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Participants</span>
              </div>
              <div className="text-sm font-bold text-white">
                {contractInfo.currentParticipants.toString()}/{contractInfo.maxParticipants.toString()}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Price</span>
              </div>
              <div className="text-sm font-bold text-green-400">
                {contractInfo.priceETH}
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className="text-sm font-bold text-white">
                  {contractInfo.isFinalized ? 'Completed' : timeRemaining > 0 ? 'Active' : 'Expired'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">Progress</div>
                <div className="text-sm font-bold text-pink-400">
                  {Math.round(participantProgress)}%
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Campaign Progress</span>
              <span>{Math.round(participantProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${participantProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <Link 
            href={`/campaign/${campaign.transaction}`}
            className="group w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            {contractInfo.isFinalized ? 'View Details' : 'Join This Deal'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full blur-sm opacity-60"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full blur-sm opacity-40"></div>
      </div>
    </div>
  );
}