import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  currentPrice: string;
  originalPrice: string;
  discount: number;
  progress: number;
  maxParticipants: number;
  remaining: number;
  timeLeft: string;
  rating: number;
  reviews: number;
  category: string;
  isHot: boolean;
  urgency: 'ending-soon' | 'trending' | 'almost-full';
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]">
      
      {/* Product Image Section */}
      <div className="relative h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className="object-contain p-8 group-hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.isHot && (
            <div className="bg-pink-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
              🔥 HOT
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
            product.urgency === 'ending-soon' ? 'bg-red-500/90 text-white' :
            product.urgency === 'trending' ? 'bg-blue-500/90 text-white' :
            'bg-green-500/90 text-white'
          }`}>
            {product.urgency === 'ending-soon' ? '⏰ ENDING SOON' :
             product.urgency === 'trending' ? '📈 TRENDING' :
             '🔥 ALMOST FULL'}
          </div>
        </div>
        
        {/* Discount Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        
        {/* Owner Section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400"></div>
          <div>
            <div className="text-xs text-gray-400 uppercase">Seller</div>
            <div className="text-sm font-medium text-gray-300">teknosa.store</div>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {product.description || 'High-quality product with excellent features and competitive bulk pricing.'}
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{product.currentPrice}</span>
            <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
          </div>
          <div className="text-sm text-green-400 font-medium">
            Save ₺{(parseInt(product.originalPrice.replace('₺', '').replace(',', '')) - parseInt(product.currentPrice.replace('₺', '').replace(',', ''))).toLocaleString()} with bulk purchase
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-sm font-bold text-white">{product.progress}/{product.maxParticipants}</div>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2 mb-3 overflow-hidden">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-700 relative"
              style={{width: `${(product.progress / product.maxParticipants) * 100}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{product.remaining} spots left</span>
            <span className="text-pink-400 font-medium">{product.timeLeft}</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            Join Bulk Purchase →
          </button>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 rounded-3xl transition-colors duration-500 pointer-events-none"></div>
    </div>
  );
}