import { ArrowLeft, Wallet, Shield, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Connection",
      description: "Your wallet stays in your control at all times"
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Connect once and start buying immediately"
    },
    {
      icon: CheckCircle,
      title: "Verified Deals",
      description: "All bulk purchases are secured by smart contracts"
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Back Button */}
          <div className="mb-12">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="text-sm font-mono text-pink-500 tracking-widest uppercase">
                  ← Connect & Start
                </div>
                <h1 className="text-5xl lg:text-6xl font-light leading-tight">
                  Connect your
                  <br />
                  <span className="font-bold">Web3 wallet</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                  Join thousands of users saving money through collective purchasing power. 
                  Connect your wallet to start your bulk buying journey.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="text-sm text-gray-500">
                  New to Web3? <span className="text-pink-500 hover:text-pink-400 cursor-pointer">Learn how to get started →</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="relative">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 max-w-md mx-auto">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-pink-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
                  <p className="text-gray-400 text-sm">Choose your preferred wallet to connect</p>
                </div>

                {/* Wallet Options */}
                <div className="space-y-4 mb-8">
                  
                  {/* MetaMask */}
                  <button className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-2xl p-4 transition-all duration-300 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <div className="text-2xl">🦊</div>
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">MetaMask</div>
                      <div className="text-xs text-gray-400">Connect using MetaMask wallet</div>
                    </div>
                    <div className="text-gray-400">→</div>
                  </button>
                </div>

                {/* Alternative Login */}
                <div className="border-t border-gray-700 pt-6 mb-6">
                  <div className="text-center mb-4">
                    <span className="text-xs text-gray-500">Or</span>
                  </div>
                  <Link
                    href="/login/corparate"
                    className="w-full bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-2xl p-4 transition-all duration-300 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <div className="text-2xl">🏢</div>
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">Corporate Login</div>
                      <div className="text-xs text-blue-200">Business accounts with email</div>
                    </div>
                    <div className="text-blue-200">→</div>
                  </Link>
                </div>

                {/* Footer */}
                <div className="text-center space-y-4">
                  <div className="text-xs text-gray-500">
                    By connecting, you agree to our{' '}
                    <span className="text-pink-500 hover:text-pink-400 cursor-pointer">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-pink-500 hover:text-pink-400 cursor-pointer">Privacy Policy</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-green-400 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Secure connection established</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </main>
  );
}