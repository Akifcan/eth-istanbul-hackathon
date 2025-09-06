"use client"
import { ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import FeaturedDealCard from '../featured-deal-card';

export default function RegularHero() {
  const router = useRouter();

  const { data: suggestedCampaign, isLoading } = useQuery({
    queryKey: ['suggested-campaign'],
    queryFn: async () => {
      const response = await api.get<CampaignProps>('/suggested-campaign');
      return response.data;
    }
  });

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
                  <span className="text-white">Ally</span>
                  <span className="text-pink-500">Buy</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-lg">
                  Join the collective. Buy together. Save more with Web3-powered bulk purchasing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push('/create')} 
                  className="group bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Start Buying Together
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => router.push('/how-it-works')} 
                  className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                >
                  How It Works
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">250K+</div>
                  <div className="text-sm text-gray-400">Active Buyers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">₺2.5M</div>
                  <div className="text-sm text-gray-400">Total Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">35%</div>
                  <div className="text-sm text-gray-400">Avg Savings</div>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Product Card */}
            <div className="lg:pl-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-400 px-4 py-2 rounded-2xl text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Featured Deal
                </div>
              </div>

              <div className="max-w-sm">
                {isLoading ? (
                  // Featured Deal Skeleton
                  <div className="relative">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6 animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
                        <div className="h-4 bg-gray-700/50 rounded w-12"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
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
                ) : suggestedCampaign ? (
                  <FeaturedDealCard campaign={suggestedCampaign} />
                ) : (
                  // No campaign fallback
                  <div className="relative">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-gray-600/20 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                        <Zap className="w-3 h-3" />
                        COMING SOON
                      </div>
                      <h3 className="text-lg font-bold text-gray-400 mb-2">No Featured Deals Yet</h3>
                      <p className="text-sm text-gray-500 mb-4">Be the first to create a campaign!</p>
                      <button 
                        onClick={() => router.push('/create')}
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-2xl font-semibold text-sm transition-colors"
                      >
                        Create Campaign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}