'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import useUserStore from '../../../store/user';
import { ArrowLeft, Users, Clock, DollarSign, Package, CheckCircle, AlertCircle, Loader, Copy, Share2, X, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import OfferForm from '../../../components/offer-form';
import JoinCampaignSidebar from '@/components/join-campaign-sidebar';
import WithdrawSidebar from '../../../components/withdraw-sidebar';
import OffersList from '../../../components/offers-list';
import TestFinalizeButton from '../../../components/test-finalize-button';

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
    const [offersRefreshTrigger, setOffersRefreshTrigger] = useState(0);
    const [isParticipant, setIsParticipant] = useState(false);
    const [checkingParticipant, setCheckingParticipant] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setSuccessMessage('Copied to clipboard!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const copyCampaignLink = async () => {
        const campaignUrl = `${window.location.origin}/campaign/${campaignId}`;
        try {
            await navigator.clipboard.writeText(campaignUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy campaign link: ', err);
        }
    };

    const shareToSocial = (platform: string) => {
        const campaignUrl = `${window.location.origin}/campaign/${campaignId}`;
        const text = `Check out this amazing campaign: ${contractInfo?.contractTitle}`;
        
        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(campaignUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + campaignUrl)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    const checkIsParticipant = async () => {
        try {
            if (!window.ethereum || !user?.address) {
                return;
            }

            setCheckingParticipant(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(campaignId, abi, provider);

            console.log('Checking if user is participant...');
            const result = await contract.isParticipant(user.address);
            console.log('Is participant:', result);
            setIsParticipant(result);

        } catch (error) {
            console.error('Error checking participant status:', error);
        } finally {
            setCheckingParticipant(false);
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
            setLoading(false);

            // Check if user is participant after getting contract info
            if (user?.address) {
                await checkIsParticipant();
            }

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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
                    <div className="flex items-center gap-4">
                        <Loader className="w-8 h-8 animate-spin text-purple-400" />
                        <span className="text-xl font-medium">Loading campaign details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !contractInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                        Campaign Not Found
                    </h1>
                    <p className="text-slate-300 mb-8 text-lg">{error}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5" />
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
            <div className="relative container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-all duration-300 mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to Campaigns</span>
                        </Link>

                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                                        {contractInfo.contractTitle}
                                    </h1>
                                    {contractInfo.isFinalized ? (
                                        <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
                                            Finalized
                                        </span>
                                    ) : isExpired ? (
                                        <span className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium border border-red-500/30">
                                            Expired
                                        </span>
                                    ) : (
                                        <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share Campaign
                                </button>
                            </div>
                            <p className="text-gray-300 text-xl leading-relaxed">
                                {contractInfo.contractDescription}
                            </p>
                        </div>
                    </div>

                    {/* Contract Address */}
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-xl p-6 mb-8 border border-slate-600/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-300 mb-2">Campaign Address</h3>
                                <code className="text-sm font-mono text-cyan-300 bg-slate-800/50 px-3 py-2 rounded-lg">
                                    {campaignId.slice(0, 10)}...{campaignId.slice(-8)}
                                </code>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => copyToClipboard(campaignId)}
                                    className="p-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105"
                                    title="Copy address"
                                >
                                    <Copy className="w-4 h-4 text-slate-300" />
                                </button>
                                <a
                                    href={`https://sepolia.etherscan.io/address/${campaignId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                                >
                                    View on Etherscan
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`grid  gap-8 ${isCorporateUser ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
                        {/* Campaign Stats */}
                        <div className="lg:col-span-2">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Participants</h3>
                                    </div>
                                    <p className="text-3xl font-bold mb-3">
                                        {contractInfo.currentParticipants.toString()} / {contractInfo.maxParticipants.toString()}
                                    </p>
                                    <div className="w-full bg-slate-700/50 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${participantProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-2">{participantProgress.toFixed(1)}% complete</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <DollarSign className="w-6 h-6 text-green-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Price per Item</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-green-400">
                                        {contractInfo.priceETH}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">ETH per participant</p>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <Clock className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">End Date</h3>
                                    </div>
                                    <p className="text-xl font-bold mb-1">
                                        {endDate.toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {endDate.toLocaleTimeString()}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-500/20 rounded-lg">
                                            <Package className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Status</h3>
                                    </div>
                                    <p className="text-xl font-bold">
                                        {contractInfo.isFinalized ? (
                                            <span className="text-green-400">✅ Completed</span>
                                        ) : isExpired ? (
                                            <span className="text-red-400">⏰ Expired</span>
                                        ) : (
                                            <span className="text-blue-400">🔄 Active</span>
                                        )}
                                    </p>
                                </div>

                                {/* Test Finalize Button */}
                                <div className="mb-8" style={{ gridColumn: '1/-1' }}>
                                    <TestFinalizeButton 
                                        contractAddress={campaignId} 
                                        onFinalizeSuccess={() => {
                                            getParticipantInfo(); // Refresh campaign info
                                            setOffersRefreshTrigger(prev => prev + 1); // Refresh offers
                                        }}
                                    />
                                </div>

                                {/* Offers List */}
                                <div className="mb-8" style={{ gridColumn: '1/-1' }}>
                                        <OffersList contractAddress={campaignId} campaignEndTime={contractInfo.contractEndDate} refreshTrigger={offersRefreshTrigger} isFinalized={contractInfo.isFinalized} />
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

                        {/* Join Campaign Sidebar - Only for Regular Users who haven't joined */}
                        {!isCorporateUser && !isParticipant && (
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

                        {/* Withdraw Sidebar - Only for Regular Users who have joined */}
                        {!isCorporateUser && isParticipant && (
                            <WithdrawSidebar
                                contractAddress={campaignId}
                                contractInfo={{
                                    priceETH: contractInfo.priceETH,
                                    isFinalized: contractInfo.isFinalized
                                }}
                                isExpired={isExpired}
                                onWithdrawSuccess={() => {
                                    getParticipantInfo(); // Refresh campaign info
                                    checkIsParticipant(); // Recheck participation status
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
                                        setOffersRefreshTrigger(prev => prev + 1); // Refresh offers list
                                        // Scroll to top
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setTimeout(() => setSuccessMessage(''), 3000);
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Share Modal */}
                    {showShareModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-slate-600/30">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Share Campaign
                                    </h3>
                                    <button
                                        onClick={() => setShowShareModal(false)}
                                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Campaign Link */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Campaign Link
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/campaign/${campaignId}`}
                                                readOnly
                                                className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50"
                                            />
                                            <button
                                                onClick={copyCampaignLink}
                                                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    copySuccess
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                                }`}
                                            >
                                                {copySuccess ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Social Media Sharing */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Share on Social Media
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => shareToSocial('twitter')}
                                                className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <Twitter className="w-5 h-5 text-blue-400" />
                                                <span className="text-sm font-medium">Twitter</span>
                                            </button>
                                            <button
                                                onClick={() => shareToSocial('facebook')}
                                                className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <Facebook className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium">Facebook</span>
                                            </button>
                                            <button
                                                onClick={() => shareToSocial('linkedin')}
                                                className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <Linkedin className="w-5 h-5 text-blue-500" />
                                                <span className="text-sm font-medium">LinkedIn</span>
                                            </button>
                                            <button
                                                onClick={() => shareToSocial('whatsapp')}
                                                className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <MessageCircle className="w-5 h-5 text-green-500" />
                                                <span className="text-sm font-medium">WhatsApp</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Share Message */}
                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                                        <p className="text-sm text-slate-400 mb-2">Share this message:</p>
                                        <p className="text-slate-300 text-sm">
                                            "Check out this amazing campaign: {contractInfo?.contractTitle}. Join now and get the best deals! 🚀"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}