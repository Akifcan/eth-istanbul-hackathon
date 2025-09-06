"use client"
import { ArrowRight, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/config/api';
import CampaignCard from '../../components/campaign.card';

export default function Campaigns() {
  const { data: campaigns, isLoading, isError } = useQuery({
    queryKey: ['all-campaigns'],
    queryFn: async () => {
      return await api.get<CampaignProps[]>('/campaigns')
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="text-sm font-mono text-blue-500 tracking-widest uppercase mb-4">
                ← All Campaigns
              </div>
              <h1 className="text-4xl lg:text-6xl font-light leading-tight mb-4">
                Browse all bulk
                <span className="font-bold"> campaigns</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Join existing campaigns or create your own to get better prices through bulk purchasing
              </p>
            </div>

            {/* Back to Home Link */}
            <div className="flex justify-center mb-8">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* Loading State */}
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

          {/* Error State */}
          {isError && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-red-300 mb-2">Failed to load campaigns</h3>
              <p className="text-red-200">
                Unable to connect to the server. Please check your connection and try again.
              </p>
            </div>
          )}

          {/* No Campaigns State */}
          {!isLoading && !isError && campaigns?.data.length === 0 && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No campaigns available</h3>
              <p className="text-gray-400 mb-6">
                Be the first to create a bulk purchase campaign and start saving money!
              </p>
              <Link 
                href="/create"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Campaign
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Campaigns Grid */}
          {!isLoading && !isError && campaigns?.data && campaigns.data.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {campaigns.data.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>

              {/* Stats */}
              <div className="text-center">
                <div className="inline-flex items-center gap-6 text-gray-400 text-sm">
                  <div>
                    <span className="text-white font-bold">{campaigns.data.length}</span> Total campaigns
                  </div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <div>
                    <span className="text-white font-bold">Average 27%</span> savings
                  </div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <div>
                    <span className="text-white font-bold">Join now</span> and save money
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}