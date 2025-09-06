'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import useUserStore from '../../store/user';
import api from '../../config/api';
import CampaignCard from '@/components/campaign.card';

export default function MyOffers() {
    const { user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const { data: offers, isLoading, isError } = useQuery({
        queryKey: ['my-offers', user?.address],
        queryFn: async () => {
            if (!user?.address) {
                throw new Error('No wallet address found');
            }
            const response = await api.get<OfferProps[]>(`/offers/${user.address}`);
            return response.data;
        },
        enabled: !!user?.address, // Only run query if user has address
    });

    useEffect(() => {
        if (offers) {
            console.log('My offers:', offers);
        }
    }, [offers]);

    useEffect(() => {
        if (isError) {
            console.log('Error fetching offers');
        }
    }, [isError]);

    useEffect(() => {
        if (isLoading) {
            console.log('Loading offers...');
        }
    }, [isLoading]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">My Offers</h1>

            {!user?.address && (
                <p className="text-red-400">Please connect your wallet to view offers</p>
            )}

            {isLoading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {Array.from({ length: 6 }).map((_, index) => (
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
                    ))}
                </div>
            )}

            {isError && (
                <p className="text-red-400">Error loading offers</p>
            )}

            {offers && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 mb-12">
                    {offers.map((offer) => {
                        return <CampaignCard key={offer.id} hideBadge campaign={{ createdWallet: offer.wallet, transaction: offer.contract, createdAt: offer.createdAt, id: offer.id }} />
                    })}
                </div>
            )}
            <p className="text-green-400">Found {offers?.length} offers</p>
        </div>
    );
}