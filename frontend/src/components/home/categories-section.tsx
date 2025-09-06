import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    { icon: '💻', name: 'Electronics', deals: '1,200+', color: 'from-blue-400 to-cyan-400' },
    { icon: '👕', name: 'Fashion', deals: '850+', color: 'from-pink-400 to-rose-400' },
    { icon: '🏠', name: 'Home & Garden', deals: '650+', color: 'from-green-400 to-emerald-400' },
    { icon: '🏃', name: 'Sports', deals: '420+', color: 'from-orange-400 to-red-400' },
    { icon: '📚', name: 'Books', deals: '320+', color: 'from-purple-400 to-violet-400' },
    { icon: '🎮', name: 'Gaming', deals: '980+', color: 'from-yellow-400 to-amber-400' },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl font-bold text-white rotate-12">SHOP</div>
        <div className="absolute bottom-10 right-10 text-6xl font-bold text-white -rotate-12">SAVE</div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-sm font-mono text-pink-500 tracking-widest uppercase mb-6">
              ← Explore Categories
            </div>
            <h2 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
              Shop smarter across
              <br />
              <span className="font-bold">every category</span>
            </h2>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative border-r border-b border-gray-800 last:border-r-0 md:last:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 hover:bg-gray-900/20 transition-all duration-300 cursor-pointer"
              >
                <div className="p-12 text-center relative">
                  
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      {category.name}
                    </h3>
                    <div className={`text-sm font-mono bg-gradient-to-r ${category.color} bg-clip-text text-transparent font-bold`}>
                      {category.deals} DEALS
                    </div>
                    
                    {/* Hidden CTA */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                      <span className="text-pink-500 text-sm font-medium">
                        Browse deals →
                      </span>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${category.color} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats & CTA */}
          <div className="mt-16 text-center space-y-8">
            <div className="inline-flex items-center gap-8 text-gray-400 text-sm">
              <div>
                <span className="text-white font-bold">6</span> Categories
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-white font-bold">4,420+</span> Active Deals
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-white font-bold">New deals</span> added daily
              </div>
            </div>
            
            <div>
              <Link 
                href="/categories"
                className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 font-medium transition-colors"
              >
                View all categories →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}