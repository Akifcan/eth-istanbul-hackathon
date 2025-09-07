export default function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Split Layout */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="text-sm font-mono text-pink-500 tracking-widest uppercase">
                  ← How it works
                </div>
                <h2 className="text-4xl lg:text-5xl font-light leading-tight">
                  Three simple steps to
                  <br />
                  <span className="font-bold">massive savings</span>
                </h2>
              </div>

              {/* Steps */}
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center">
                      <span className="text-pink-500 font-bold">01</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Find Products</h3>
                    <p className="text-gray-400 leading-relaxed">Browse thousands of products and find the items you want to purchase in bulk.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center">
                      <span className="text-pink-500 font-bold">02</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Join Groups</h3>
                    <p className="text-gray-400 leading-relaxed">Connect your wallet and join existing bulk purchase groups or create your own.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center bg-pink-500">
                      <span className="text-black font-bold">03</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Save Money</h3>
                    <p className="text-gray-400 leading-relaxed">Unlock wholesale prices and save up to 40% on your purchases through collective buying power.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="text-pink-500 hover:text-pink-400 font-medium inline-flex items-center gap-2 transition-colors">
                  Start your first group purchase →
                </button>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative w-full max-w-md mx-auto">
                
                {/* Background Circles */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-32 h-32 border border-gray-800 rounded-full"></div>
                  <div className="absolute top-16 right-16 w-24 h-24 border border-gray-700 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 border border-gray-800 rounded-full"></div>
                </div>

                {/* Content Cards */}
                <div className="relative space-y-6 z-10">
                  
                  {/* Top Card - Users */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 ml-12">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-gray-900"></div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-900"></div>
                        <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center">
                          <span className="text-xs text-white">+5</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">8 people joined</div>
                        <div className="text-gray-400 text-sm">2 spots left</div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Card - Price */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mr-12">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">$900</div>
                      <div className="text-gray-400 line-through text-sm">$1000</div>
                      <div className="text-green-400 text-sm font-medium">10% saved</div>
                    </div>
                  </div>

                  {/* Bottom Card - Timer */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 ml-8">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-semibold">Deal ends in</div>
                      <div className="text-pink-500 font-mono">23:45:12</div>
                    </div>
                    <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}