'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { Users, DollarSign, Package, AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';

const { abi } = contractArtifact;

export default function CampaignCard({ campaign }: {campaign: CampaignProps}) {
    const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getContractInfo = async () => {
        try {
            if (!window.ethereum) {
                setError("MetaMask is required!");
                return;
            }

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

            console.log(info.senderCompany)

            setContractInfo(info);
            setLoading(false);

        } catch (error) {
            console.error('Error getting campaign info:', error);
            setError('Failed to load campaign');
            setLoading(false);
        }
    };

    useEffect(() => {
        getContractInfo();
    }, [campaign.transaction]);

    if (loading) {
        return (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-center h-48">
                    <Loader className="w-8 h-8 animate-spin text-blue-400" />
                </div>
            </div>
        );
    }

    if (error || !contractInfo) {
        return (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-center h-48 text-center">
                    <div>
                        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-red-300 text-sm">Failed to load campaign</p>
                    </div>
                </div>
            </div>
        );
    }

    const progressPercentage = Number(contractInfo.currentParticipants) / Number(contractInfo.maxParticipants) * 100;

    return (
        <Link href={`/campaign/${campaign.transaction}`} className="block group">
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/30 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative p-6 z-10">
                    
                    {/* Header with Status Badge */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">{contractInfo.contractTitle}</h3>
                            <p className="text-gray-400 text-xs line-clamp-2">{contractInfo.contractDescription}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ml-3 ${
                            contractInfo.isFinalized 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                            {contractInfo.isFinalized ? 'Finished' : 'Active'}
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{contractInfo.priceETH}</span>
                            <span className="text-sm text-blue-400 font-medium">ETH</span>
                            <span className="text-xs text-gray-500">per item</span>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium text-gray-300">Campaign Progress</span>
                            <span className="text-xs text-white font-bold">
                                {Number(contractInfo.currentParticipants)}/{Number(contractInfo.maxParticipants)}
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="w-full bg-gray-800 rounded-full h-3 shadow-inner">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-center">
                                <span className="text-blue-400 font-medium">{progressPercentage.toFixed(0)}% Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
                            <div className="flex items-center gap-2 mb-1">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-medium text-gray-300">Joined</span>
                            </div>
                            <div className="text-lg font-bold text-white">
                                {Number(contractInfo.currentParticipants)}
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
                            <div className="flex items-center gap-2 mb-1">
                                <Package className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-medium text-gray-300">Remaining</span>
                            </div>
                            <div className="text-lg font-bold text-white">
                                {Number(contractInfo.maxParticipants) - Number(contractInfo.currentParticipants)}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/30">
                        <div className="text-xs text-gray-500">
                            By: {campaign.createdWallet.slice(0, 6)}...{campaign.createdWallet.slice(-4)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                            <span>View Details</span>
                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
        </Link>
    );
}