'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import useUserStore from '../../../store/user';
import { ArrowLeft, Users, Clock, DollarSign, Package, CheckCircle, AlertCircle, Loader, Copy } from 'lucide-react';
import Link from 'next/link';
import OfferForm from '../../../components/offer-form';
import JoinCampaignSidebar from '@/components/join-campaign-sidebar';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const { abi } = contractArtifact;

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

interface PurchaseFormData {
    fullName: string;
    userAddress: string;
    phoneNumber: string;
}

export default function CampaignDetail() {
    const params = useParams();
    const { user } = useUserStore();
    const campaignId = params.id as string;

    const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setSuccessMessage('Copied to clipboard!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const getParticipantInfo = async () => {
        try {
            if (!window.ethereum) {
                setError("MetaMask is required!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(campaignId, abi, provider);

            console.log('Calling getParticipantInfo...');
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

            console.log('Campaign Info:', info);
            setContractInfo(info);
            setLoading(false);

        } catch (error) {
            console.error('Error getting campaign info:', error);
            setError('Failed to load campaign information');
            setLoading(false);
        }
    };


    useEffect(() => {
        if (campaignId) {
            getParticipantInfo();
        }
    }, [campaignId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Loading campaign details...</span>
                </div>
            </div>
        );
    }

    if (error && !contractInfo) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Campaign Not Found</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!contractInfo) return null;

    const endDate = new Date(parseInt(contractInfo.contractEndDate) * 1000);
    const isExpired = endDate < new Date();
    const participantProgress = (Number(contractInfo.currentParticipants) / Number(contractInfo.maxParticipants)) * 100;
    
    // Check if user is corporate (has profilePhoto, name, and email)
    const isCorporateUser = user && user.profilePhoto && user.name && user.email;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to home
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl font-bold">{contractInfo.contractTitle}</h1>
                            {contractInfo.isFinalized ? (
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                    Finalized
                                </span>
                            ) : isExpired ? (
                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                                    Expired
                                </span>
                            ) : (
                                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                    Active
                                </span>
                            )}
                        </div>
                        
                        <p className="text-gray-400 text-lg">{contractInfo.contractDescription}</p>
                    </div>

                    {/* Contract Address */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-8 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Campaign Address</h3>
                                <code className="text-sm font-mono text-blue-300">
                                    {campaignId.slice(0, 10)}...{campaignId.slice(-8)}
                                </code>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(campaignId)}
                                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                                    title="Copy address"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <a
                                    href={`https://sepolia.etherscan.io/address/${campaignId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm underline px-2 py-2"
                                >
                                    View on Etherscan
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Campaign Stats */}
                        <div className="lg:col-span-2">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Users className="w-6 h-6 text-blue-400" />
                                        <h3 className="font-semibold">Participants</h3>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {contractInfo.currentParticipants.toString()} / {contractInfo.maxParticipants.toString()}
                                    </p>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${participantProgress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign className="w-6 h-6 text-green-400" />
                                        <h3 className="font-semibold">Price per Item</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">
                                        {contractInfo.priceETH}
                                    </p>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-6 h-6 text-yellow-400" />
                                        <h3 className="font-semibold">End Date</h3>
                                    </div>
                                    <p className="text-lg">
                                        {endDate.toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {endDate.toLocaleTimeString()}
                                    </p>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="w-6 h-6 text-purple-400" />
                                        <h3 className="font-semibold">Status</h3>
                                    </div>
                                    <p className="text-lg">
                                        {contractInfo.isFinalized ? (
                                            <span className="text-green-400">✅ Completed</span>
                                        ) : isExpired ? (
                                            <span className="text-red-400">⏰ Expired</span>
                                        ) : (
                                            <span className="text-blue-400">🔄 Active</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Winner Info */}
                            {contractInfo.isFinalized && contractInfo.senderCompany !== '0x0000000000000000000000000000000000000000' && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                        <h3 className="text-xl font-semibold text-green-400">Winner Selected!</h3>
                                    </div>
                                    <p className="text-green-300">
                                        <strong>Winner Company:</strong> 
                                        <code className="ml-2 bg-gray-800 px-2 py-1 rounded text-sm">
                                            {contractInfo.senderCompany}
                                        </code>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Join Campaign Sidebar - Only for Regular Users */}
                        {!isCorporateUser && (
                            <JoinCampaignSidebar 
                                contractAddress={campaignId}
                                contractInfo={{
                                    priceETH: contractInfo.priceETH,
                                    isFinalized: contractInfo.isFinalized
                                }}
                                isExpired={isExpired}
                                onJoinSuccess={() => {
                                    getParticipantInfo(); // Refresh campaign info
                                }}
                            />
                        )}

                        
                    </div>
                             {/* Show OfferForm for Corporate Users, PurchaseForm for Regular Users */}
                    {!contractInfo.isFinalized && !isExpired && (
                        <div className="mb-8">
                            {isCorporateUser && (
                                <OfferForm 
                                    contractAddress={campaignId}
                                    onOfferSuccess={() => {
                                        setSuccessMessage('Offer submitted successfully!');
                                        getParticipantInfo(); // Refresh campaign info
                                        setTimeout(() => setSuccessMessage(''), 3000);
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}