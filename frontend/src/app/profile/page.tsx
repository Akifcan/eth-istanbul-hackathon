'use client';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useUserStore from '../../store/user';
import api from '@/config/api';
import CampaignCard from '../../components/campaign.card';
import { AlertCircle } from 'lucide-react';

export default function Profile() {
    const { user } = useUserStore();
    const router = useRouter();
   
    useEffect(() => {
        if(!user){
            router.push('/login')
            return 
        }
    }, [user])

    const { data: myCampaigns, isLoading, isError } = useQuery({
        queryKey: ['my-campaigns', user?.address],
        queryFn: async () => {
            return await api.get<CampaignProps[]>(`/campaigns?createdWallet=${user?.address}`)
        }
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Profile</h1>
                    
                    {/* User Info */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 mb-12">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Wallet Address
                                </label>
                                <div className="text-lg font-mono text-blue-400 break-all">
                                    {user?.address}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* My Campaigns Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">My Campaigns</h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                // Skeleton loading
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse">
                                        <div className="h-48 bg-gray-700/50 rounded-xl mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-6 bg-gray-700/50 rounded"></div>
                                            <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                                            <div className="flex gap-2">
                                                <div className="h-8 bg-gray-700/50 rounded w-20"></div>
                                                <div className="h-8 bg-gray-700/50 rounded w-16"></div>
                                            </div>
                                            <div className="h-2 bg-gray-700/50 rounded mb-2"></div>
                                            <div className="flex justify-between text-sm">
                                                <div className="h-4 bg-gray-700/50 rounded w-16"></div>
                                                <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : isError ? (
                                // Error state
                                <div className="col-span-full">
                                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
                                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-red-300 mb-2">Failed to load your campaigns</h3>
                                        <p className="text-red-200 text-sm">
                                            Unable to connect to the server. Please check your connection and try again.
                                        </p>
                                    </div>
                                </div>
                            ) : myCampaigns?.data.length === 0 ? (
                                // No campaigns
                                <div className="col-span-full">
                                    <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-8 text-center">
                                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No campaigns yet</h3>
                                        <p className="text-gray-400 text-sm mb-4">
                                            You haven't created any campaigns yet. Start by creating your first bulk purchase campaign!
                                        </p>
                                        
                                        <button 
                                            onClick={() => router.push('/create')}
                                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                                        >
                                            Create Campaign
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                myCampaigns?.data.map((campaign) => {
                                    return <CampaignCard key={campaign.id} campaign={campaign} />
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}