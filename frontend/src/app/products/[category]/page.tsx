'use client';

import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../../../components/product-card';

interface CategoryProductsPageProps {
  params: {
    category: string;
  };
}

export default function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Decode the category from URL
  const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');
  const categoryNameFormatted = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  // Mock products data - in real app this would be fetched based on category
  const allProducts = [
    {
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
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Latest flagship smartphone with S Pen and advanced camera',
      image: '/products/samsung.jpg',
      currentPrice: '₺32,999',
      originalPrice: '₺42,999',
      discount: 23,
      progress: 61,
      maxParticipants: 150,
      remaining: 89,
      timeLeft: '5 days left',
      rating: 4.7,
      reviews: 89,
      category: 'Electronics',
      isHot: false,
      urgency: 'trending' as const
    },
    {
      id: 3,
      name: 'MacBook Air M2',
      description: 'Ultra-thin laptop with M2 chip and all-day battery',
      image: '/products/iphone-15.avif',
      currentPrice: '₺28,999',
      originalPrice: '₺35,999',
      discount: 19,
      progress: 38,
      maxParticipants: 90,
      remaining: 52,
      timeLeft: '6 days left',
      rating: 4.8,
      reviews: 203,
      category: 'Electronics',
      isHot: false,
      urgency: 'trending' as const
    },
    {
      id: 4,
      name: 'iPad Pro 12.9"',
      description: 'Professional tablet with M2 chip and Liquid Retina display',
      image: '/products/samsung.jpg',
      currentPrice: '₺22,999',
      originalPrice: '₺29,999',
      discount: 23,
      progress: 67,
      maxParticipants: 75,
      remaining: 25,
      timeLeft: '4 days left',
      rating: 4.7,
      reviews: 145,
      category: 'Electronics',
      isHot: true,
      urgency: 'almost-full' as const
    },
    {
      id: 5,
      name: 'AirPods Pro 2nd Gen',
      description: 'Active noise cancelling wireless earbuds',
      image: '/products/iphone-15.avif',
      currentPrice: '₺3,999',
      originalPrice: '₺4,999',
      discount: 20,
      progress: 89,
      maxParticipants: 200,
      remaining: 22,
      timeLeft: '8 hours left',
      rating: 4.6,
      reviews: 267,
      category: 'Electronics',
      isHot: true,
      urgency: 'ending-soon' as const
    },
    {
      id: 6,
      name: 'Vestel 55" 4K Smart TV',
      description: 'Ultra HD smart television with streaming capabilities',
      image: '/products/vestel-televizyon.jpg',
      currentPrice: '₺8,999',
      originalPrice: '₺12,999',
      discount: 31,
      progress: 56,
      maxParticipants: 80,
      remaining: 24,
      timeLeft: '1 day left',
      rating: 4.5,
      reviews: 67,
      category: 'Home & Garden',
      isHot: true,
      urgency: 'almost-full' as const
    },
    {
      id: 7,
      name: 'LG OLED 65" TV',
      description: 'Premium OLED display with perfect blacks',
      image: '/products/vestel-televizyon.jpg',
      currentPrice: '₺24,999',
      originalPrice: '₺32,999',
      discount: 24,
      progress: 34,
      maxParticipants: 60,
      remaining: 40,
      timeLeft: '7 days left',
      rating: 4.8,
      reviews: 89,
      category: 'Home & Garden',
      isHot: false,
      urgency: 'trending' as const
    },
    {
      id: 8,
      name: 'PlayStation 5 Console',
      description: 'Next-gen gaming console with lightning-fast loading',
      image: '/products/ps5.webp',
      currentPrice: '₺15,999',
      originalPrice: '₺19,999',
      discount: 20,
      progress: 45,
      maxParticipants: 120,
      remaining: 75,
      timeLeft: '3 days left',
      rating: 4.9,
      reviews: 156,
      category: 'Gaming',
      isHot: false,
      urgency: 'trending' as const
    },
    {
      id: 9,
      name: 'Xbox Series X',
      description: 'Most powerful Xbox console with 4K gaming',
      image: '/products/ps5.webp',
      currentPrice: '₺13,999',
      originalPrice: '₺17,999',
      discount: 22,
      progress: 52,
      maxParticipants: 100,
      remaining: 48,
      timeLeft: '5 days left',
      rating: 4.7,
      reviews: 123,
      category: 'Gaming',
      isHot: false,
      urgency: 'trending' as const
    },
    {
      id: 10,
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with air cushioning',
      image: '/products/samsung.jpg',
      currentPrice: '₺1,299',
      originalPrice: '₺1,699',
      discount: 24,
      progress: 82,
      maxParticipants: 200,
      remaining: 36,
      timeLeft: '12 hours left',
      rating: 4.6,
      reviews: 87,
      category: 'Fashion',
      isHot: true,
      urgency: 'ending-soon' as const
    }
  ];

  // Show all products regardless of category
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category info mapping
  const categoryInfo: Record<string, { icon: string; description: string; color: string }> = {
    'electronics': { 
      icon: '💻', 
      description: 'Smartphones, laptops, tablets, and more tech essentials',
      color: 'from-blue-400 to-cyan-400'
    },
    'fashion': { 
      icon: '👕', 
      description: 'Clothing, accessories, shoes for every style',
      color: 'from-pink-400 to-rose-400'
    },
    'home & garden': { 
      icon: '🏠', 
      description: 'Furniture, appliances, gardening supplies',
      color: 'from-green-400 to-emerald-400'
    },
    'gaming': { 
      icon: '🎮', 
      description: 'Gaming consoles, accessories, digital games',
      color: 'from-yellow-400 to-amber-400'
    },
    'sports': { 
      icon: '🏃', 
      description: 'Fitness equipment, sportswear, outdoor gear',
      color: 'from-orange-400 to-red-400'
    },
    'books': { 
      icon: '📚', 
      description: 'Educational books, novels, digital content',
      color: 'from-purple-400 to-violet-400'
    }
  };

  const currentCategoryInfo = categoryInfo[categoryName.toLowerCase()] || {
    icon: '📦',
    description: 'Quality products at great prices',
    color: 'from-gray-400 to-gray-600'
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <Link 
                href="/categories"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to categories
              </Link>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{currentCategoryInfo.icon}</div>
                <div>
                  <div className="text-sm font-mono text-pink-500 tracking-widest uppercase mb-2">
                    ← Category
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-light leading-tight">
                    {categoryNameFormatted}
                    <span className="font-bold"> deals</span>
                  </h1>
                </div>
              </div>
              <p className="text-xl text-gray-400 max-w-3xl">
                {currentCategoryInfo.description}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search in ${categoryNameFormatted}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-16">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold text-white">{filteredProducts.length}</div>
                  <div className="text-sm text-gray-400">{searchTerm ? 'Search Results' : 'Products'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{allProducts.length}</div>
                  <div className="text-sm text-gray-400">Total Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(allProducts.reduce((acc, product) => acc + product.discount, 0) / allProducts.length)}%
                  </div>
                  <div className="text-sm text-gray-400">Avg Savings</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Updated <span className="text-white">2 minutes ago</span>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mb-8">
              <div className="text-gray-400">
                {filteredProducts.length > 0 ? (
                  <>
                    Found <span className="text-white font-bold">{filteredProducts.length}</span> results for 
                    <span className="text-pink-400 font-medium"> "{searchTerm}"</span> in {categoryNameFormatted}
                  </>
                ) : (
                  <>
                    No results found for <span className="text-pink-400 font-medium">"{searchTerm}"</span> in {categoryNameFormatted}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">No matching products</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                We couldn't find any products matching your search in {categoryNameFormatted}. Try different keywords.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-2xl font-semibold transition-colors"
              >
                Show All {categoryNameFormatted} Products
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}