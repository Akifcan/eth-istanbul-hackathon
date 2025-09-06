"use client"
import { ArrowRight, Building2, Users, TrendingUp, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserProps } from '../../types/user';

interface CorporateHeroProps {
  user: UserProps;
}

export default function CorporateHero({ user }: CorporateHeroProps) {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Corporate Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-2xl text-sm font-semibold mb-6">
              <Building2 className="w-5 h-5" />
              Corporate Account
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Welcome back, <span className="text-blue-400">{user.name}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your corporate dashboard is ready. Start creating bulk purchase campaigns or browse ongoing deals for your business.
            </p>
          </div>

          {/* Corporate Profile Card */}
          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Profile Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500/30">
                  <img 
                    src={user.profilePhoto} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80/4F46E5/FFFFFF?text=' + user.name?.charAt(0);
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                  <p className="text-blue-400 text-lg">{user.email}</p>
                  <p className="text-gray-400 text-sm">Corporate Account</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-xs text-gray-400">Active Campaigns</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">₺15.2K</div>
                  <div className="text-xs text-gray-400">Total Saved</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
              
              <button 
                onClick={() => router.push('/campaigns')}
                className="w-full group bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-lg">View Campaigns</div>
                  <div className="text-blue-200 text-sm">Browse active campaigns</div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => router.push('/offers')}
                className="w-full group bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-2xl transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-lg">Show Offers</div>
                  <div className="text-gray-400 text-sm">Submit competitive offers</div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Corporate Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-sm text-gray-400">Completed Deals</div>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">₺45K</div>
              <div className="text-sm text-gray-400">Volume Purchased</div>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400">32%</div>
              <div className="text-sm text-gray-400">Avg Savings</div>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-pink-400">4.9★</div>
              <div className="text-sm text-gray-400">Seller Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}