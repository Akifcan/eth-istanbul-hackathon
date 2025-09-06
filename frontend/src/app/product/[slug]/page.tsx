import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Shield, Zap, CheckCircle, TrendingDown, ExternalLink } from 'lucide-react';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Mock product data - in real app this would be fetched based on slug
  const product = {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: 'Latest flagship smartphone with advanced features including A17 Pro chip, titanium design, and advanced camera system.',
    fullDescription: 'The iPhone 15 Pro Max represents the pinnacle of smartphone technology with its revolutionary A17 Pro chip, built on a 3-nanometer process. Features include a stunning Super Retina XDR display, advanced camera system with 5x telephoto zoom, and a durable titanium design that\'s both lighter and stronger than steel.',
    images: [
      '/products/iphone-15.avif',
      '/products/iphone-15.avif',
      '/products/iphone-15.avif'
    ],
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
    brand: 'Apple',
    isHot: true,
    urgency: 'ending-soon' as const,
    features: [
      'A17 Pro chip with 6-core GPU',
      'Super Retina XDR display',
      'Pro camera system with 5x telephoto',
      'Titanium design',
      'iOS 17 with new features'
    ],
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Storage': '256GB',
      'Battery': 'Up to 29 hours video playback',
      'Material': 'Titanium with Ceramic Shield front'
    }
  };

  const participants = [
    { name: 'Ahmet K.', avatar: '👤', joined: '2 hours ago' },
    { name: 'Zeynep M.', avatar: '👤', joined: '5 hours ago' },
    { name: 'Mehmet S.', avatar: '👤', joined: '1 day ago' },
    { name: 'Ayşe T.', avatar: '👤', joined: '1 day ago' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to deals
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Left Side - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill
                  className="object-contain p-8" 
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.isHot && (
                    <div className="bg-pink-500 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      HOT DEAL
                    </div>
                  )}
                  <div className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-bold">
                    ⏰ ENDING SOON
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-lg font-bold border border-gray-700">
                    -{product.discount}%
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(0, 3).map((image, index) => (
                  <div key={index} className="relative h-24 bg-gray-900/30 rounded-xl border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors">
                    <Image 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      fill
                      className="object-contain p-2" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-8">
              
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 uppercase font-medium">{product.category}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-500 font-medium">Teknosa</span>
                </div>
                
                <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>
                <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Pricing */}
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-white">{product.currentPrice}</div>
                    <div className="text-lg text-gray-500 line-through">{product.originalPrice}</div>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-semibold">
                      Save ₺{(parseInt(product.originalPrice.replace('₺', '').replace(',', '')) - parseInt(product.currentPrice.replace('₺', '').replace(',', ''))).toLocaleString()}
                    </span>
                    <span className="text-gray-400">with bulk purchase</span>
                  </div>
                </div>
              </div>

              {/* Progress & Urgency */}
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Bulk Purchase Progress</h3>
                    <div className="flex items-center gap-2 text-pink-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{product.timeLeft}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Participants</span>
                      <span className="font-bold">{product.progress}/{product.maxParticipants}</span>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-pink-500 h-2 rounded-full transition-all duration-700 relative"
                        style={{width: `${(product.progress / product.maxParticipants) * 100}%`}}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{product.remaining} spots remaining</span>
                      <span className="text-pink-400 font-semibold">{Math.round((product.progress / product.maxParticipants) * 100)}% complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]">
                  <Users className="w-5 h-5" />
                  Join Bulk Purchase
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Sections */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            
            {/* Recent Participants */}
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-bold">Participants</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{product.progress}</div>
                <div className="text-gray-400 text-sm">Total Participants</div>
                <div className="text-xs text-gray-500 mt-2">
                  {product.remaining} spots remaining out of {product.maxParticipants}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-gray-400 text-sm">{key}</span>
                    <span className="text-white text-sm text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Contract */}
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold">Smart Contract</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Contract Verified</div>
                    <div className="text-xs text-gray-400">All transactions are blockchain secured</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Guaranteed Delivery</div>
                    <div className="text-xs text-gray-400">Full refund if target not reached</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <a 
                    href="https://sepolia.etherscan.io/address/0x18949854C70C42DEFEE1066eb4ea226c0F9da9Ed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-500 hover:text-pink-400 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Etherscan
                  </a>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    0x18949...9da9Ed
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Full Description */}
          <div className="mt-16">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6">Product Details</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed">{product.fullDescription}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}