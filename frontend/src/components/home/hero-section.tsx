import { ArrowRight, Zap } from 'lucide-react';
import ProductCard from '../product-card';

export default function HeroSection() {
  const featuredProduct = {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: 'Latest flagship smartphone with advanced features',
    image: '/products/iphone-15.avif',
    currentPrice: '₺39,999',
    originalPrice: '₺54,999',
    discount: 27,
    progress: 73,
    maxParticipants: 100,
    remaining: 27,
    timeLeft: '2 days left',
    rating: 4.8,
    reviews: 124,
    category: 'Electronics',
    isHot: true,
    urgency: 'ending-soon' as const
  };

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
                <button className="group bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3">
                  Start Buying Together
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300">
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
                <ProductCard product={featuredProduct} />
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