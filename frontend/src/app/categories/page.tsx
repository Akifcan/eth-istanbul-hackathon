import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    { 
      icon: '💻', 
      name: 'Electronics', 
      deals: '1,200+', 
      color: 'from-blue-400 to-cyan-400',
      description: 'Smartphones, laptops, tablets, and more tech essentials',
      avgSaving: '35%'
    },
    { 
      icon: '👕', 
      name: 'Fashion', 
      deals: '850+', 
      color: 'from-pink-400 to-rose-400',
      description: 'Clothing, accessories, shoes for every style',
      avgSaving: '42%'
    },
    { 
      icon: '🏠', 
      name: 'Home & Garden', 
      deals: '650+', 
      color: 'from-green-400 to-emerald-400',
      description: 'Furniture, appliances, gardening supplies',
      avgSaving: '28%'
    },
    { 
      icon: '🏃', 
      name: 'Sports', 
      deals: '420+', 
      color: 'from-orange-400 to-red-400',
      description: 'Fitness equipment, sportswear, outdoor gear',
      avgSaving: '38%'
    },
    { 
      icon: '📚', 
      name: 'Books', 
      deals: '320+', 
      color: 'from-purple-400 to-violet-400',
      description: 'Educational books, novels, digital content',
      avgSaving: '45%'
    },
    { 
      icon: '🎮', 
      name: 'Gaming', 
      deals: '980+', 
      color: 'from-yellow-400 to-amber-400',
      description: 'Gaming consoles, accessories, digital games',
      avgSaving: '31%'
    },
    { 
      icon: '🍳', 
      name: 'Kitchen', 
      deals: '560+', 
      color: 'from-red-400 to-pink-400',
      description: 'Cookware, appliances, kitchen gadgets',
      avgSaving: '40%'
    },
    { 
      icon: '🚗', 
      name: 'Automotive', 
      deals: '290+', 
      color: 'from-indigo-400 to-blue-400',
      description: 'Car accessories, maintenance tools, parts',
      avgSaving: '25%'
    },
    { 
      icon: '💄', 
      name: 'Beauty', 
      deals: '740+', 
      color: 'from-rose-400 to-pink-400',
      description: 'Skincare, makeup, personal care products',
      avgSaving: '48%'
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <div className="mb-8">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-mono text-pink-500 tracking-widest uppercase">
                ← All Categories
              </div>
              <h1 className="text-5xl lg:text-6xl font-light leading-tight">
                Browse all
                <span className="font-bold"> categories</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl">
                Explore our complete range of categories and discover amazing bulk deals across every product type.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-16">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold text-white">9</div>
                  <div className="text-sm text-gray-400">Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">6,010+</div>
                  <div className="text-sm text-gray-400">Active Deals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">36%</div>
                  <div className="text-sm text-gray-400">Avg Savings</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Updated <span className="text-white">2 minutes ago</span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-mono bg-gradient-to-r ${category.color} bg-clip-text text-transparent font-bold`}>
                      {category.deals}
                    </div>
                    <div className="text-xs text-gray-400">DEALS</div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <div className="text-lg font-bold text-green-400">{category.avgSaving}</div>
                      <div className="text-xs text-gray-400">Avg Savings</div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-pink-500 text-sm font-medium">
                        Browse deals →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}