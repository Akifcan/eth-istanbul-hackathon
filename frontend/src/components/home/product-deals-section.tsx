import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../product-card';

export default function ProductDealsSection() {
  const products = [
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
      urgency: 'ending-soon'
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
      remaining: 59,
      timeLeft: '5 days left',
      rating: 4.7,
      reviews: 89,
      category: 'Electronics',
      isHot: false,
      urgency: 'trending'
    },
    {
      id: 3,
      name: 'Vestel 55" 4K Smart TV',
      description: 'Ultra HD smart television with streaming capabilities',
      image: '/products/vestel-televizyon.jpg',
      currentPrice: '₺8,999',
      originalPrice: '₺12,999',
      discount: 31,
      progress: 56,
      maxParticipants: 80,
      remaining: 35,
      timeLeft: '1 day left',
      rating: 4.5,
      reviews: 67,
      category: 'Home & TV',
      isHot: true,
      urgency: 'almost-full'
    }
  ];

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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 text-gray-400 text-sm">
              <div>
                <span className="text-white font-bold">3</span> Featured deals
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-white font-bold">Average 27%</span> savings
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-white font-bold">72 hours</span> avg time left
              </div>
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