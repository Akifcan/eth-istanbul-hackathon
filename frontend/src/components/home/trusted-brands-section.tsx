import Image from 'next/image';

export default function TrustedBrandsSection() {
  const brands = [
    { name: 'Arçelik', logo: '/brands/arcelik.png', deals: '1,200+ deals' },
    { name: 'Media Markt', logo: '/brands/media-markt.png', deals: '850+ deals' },
    { name: 'Teknosa', logo: '/brands/teknosa.png', deals: '650+ deals' },
    { name: 'Vatan Bilgisayar', logo: '/brands/vatan.jpg', deals: '420+ deals' },
    { name: 'Vestel', logo: '/brands/vestel.png', deals: '980+ deals' },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl font-bold text-white">ALLY</div>
        <div className="absolute bottom-20 right-20 text-9xl font-bold text-white">BUY</div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Stats */}
          <div className="grid lg:grid-cols-2 gap-16 items-end mb-20">
            <div>
              <div className="text-sm font-mono text-pink-500 tracking-widest uppercase mb-4">
                ← Ecosystem
              </div>
              <h2 className="text-4xl lg:text-6xl font-light leading-tight">
                Trusted by industry 
                <span className="font-bold">leaders</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-gray-400 text-sm">Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.1K+</div>
                <div className="text-gray-400 text-sm">Active Deals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">₺15M+</div>
                <div className="text-gray-400 text-sm">Total Volume</div>
              </div>
            </div>
          </div>

          {/* Brands List */}
          <div className="space-y-1">
            {brands.map((brand, index) => (
              <div 
                key={index} 
                className="group border-b border-gray-800 hover:border-gray-700 transition-colors duration-300"
              >
                <div className="flex items-center justify-between py-8 px-4">
                  
                  {/* Brand Info */}
                  <div className="flex items-center gap-8">
                    <div className="text-2xl font-mono text-gray-600 group-hover:text-pink-500 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="w-32 h-16 bg-white rounded-xl p-3 flex items-center justify-center">
                      <Image 
                        src={brand.logo} 
                        alt={brand.name} 
                        width={128} 
                        height={64} 
                        className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors">
                        {brand.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        Electronics & Technology
                      </div>
                    </div>
                  </div>

                  {/* Stats & Action */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{brand.deals}</div>
                      <div className="text-sm text-gray-400">Completed</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="text-pink-500 hover:text-pink-400 font-medium text-sm">
                        View deals →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 text-gray-400">
              <div className="text-sm">Want to partner with us?</div>
              <button className="text-pink-500 hover:text-pink-400 font-medium transition-colors">
                Get in touch →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}