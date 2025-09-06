"use client"
import { ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/config/api';
import CampaignCard from '../campaign.card';

export default function ProductDealsSection() {
  const { data: campaigns, isLoading, isError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      return await api.get<CampaignProps[]>('/campaigns?limit=3')
    }
  });

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-16 text-7xl font-bold text-white -rotate-12">DEAL</div>
        <div className="absolute bottom-16 right-16 text-7xl font-bold text-white rotate-12">SAVE</div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="text-sm font-mono text-pink-500 tracking-widest uppercase mb-6">
                ← Trending Now
              </div>
              <h2 className="text-4xl lg:text-5xl font-light leading-tight">
                Featured bulk
                <span className="font-bold"> deals</span>
              </h2>
            </div>
            
            <div className="hidden md:block">
              <Link 
                href="/deals"
                className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 font-medium transition-colors"
              >
                Browse all deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 mb-12">
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
                  <h3 className="text-xl font-semibold text-red-300 mb-2">Failed to load campaigns</h3>
                  <p className="text-red-200 text-sm">
                    Unable to connect to the server. Please check your connection and try again.
                  </p>
                </div>
              </div>
            ) : (
              campaigns?.data.map((campaign) => {
                return <CampaignCard key={campaign.id} campaign={campaign} />
              })
            )}
          </div>

          {/* Bottom Stats */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 text-gray-400 text-sm">
              <div>
                <span className="text-white font-bold">{campaigns?.data.length}</span> Featured deals
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-white font-bold">Average 27%</span> savings
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Mobile CTA */}
            <div className="md:hidden mt-8">
              <Link 
                href="/deals"
                className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 font-medium transition-colors"
              >
                Browse all deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}