import { ArrowLeft, Wallet, Clock, CheckCircle, XCircle, ExternalLink, Settings, LogOut, Copy } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock user data
  const user = {
    address: '0x742d35Cc5fF30b3b4C3E7c68A3Fa3B20E5b7A1eD',
    shortAddress: '0x742d...A1eD',
    totalSaved: '∫45,670',
    totalTransactions: 23,
    activeDeals: 5,
    completedDeals: 18
  };

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      type: 'join',
      product: 'iPhone 15 Pro Max',
      amount: '∫39,999',
      status: 'completed',
      date: '2 hours ago',
      txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
      participants: '73/100'
    },
    {
      id: 2,
      type: 'join',
      product: 'Samsung Galaxy S24 Ultra',
      amount: '∫32,999',
      status: 'pending',
      date: '1 day ago',
      txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g',
      participants: '61/150'
    },
    {
      id: 3,
      type: 'join',
      product: 'MacBook Air M2',
      amount: '∫28,999',
      status: 'completed',
      date: '3 days ago',
      txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h',
      participants: '90/90'
    },
    {
      id: 4,
      type: 'join',
      product: 'PlayStation 5 Console',
      amount: '∫15,999',
      status: 'failed',
      date: '5 days ago',
      txHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i',
      participants: '45/120'
    },
    {
      id: 5,
      type: 'join',
      product: 'AirPods Pro 2nd Gen',
      amount: '∫3,999',
      status: 'completed',
      date: '1 week ago',
      txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j',
      participants: '200/200'
    },
    {
      id: 6,
      type: 'join',
      product: 'Vestel 55" 4K Smart TV',
      amount: '∫8,999',
      status: 'completed',
      date: '1 week ago',
      txHash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k',
      participants: '80/80'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
              
              <div className="flex items-center gap-4">
                <button className="p-2 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors">
                  <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button className="p-2 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors">
                  <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-mono text-pink-500 tracking-widest uppercase">
                ê My Profile
              </div>
              <h1 className="text-5xl lg:text-6xl font-light leading-tight">
                Wallet
                <span className="font-bold"> Dashboard</span>
              </h1>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Connected Wallet</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-mono">{user.shortAddress}</span>
                    <button 
                      onClick={() => copyToClipboard(user.address)}
                      className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-pink-400">{user.totalSaved}</div>
                <div className="text-sm text-gray-400">Total Saved</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/20 rounded-2xl p-6">
                <div className="text-2xl font-bold text-white">{user.totalTransactions}</div>
                <div className="text-sm text-gray-400">Total Transactions</div>
              </div>
              <div className="bg-black/20 rounded-2xl p-6">
                <div className="text-2xl font-bold text-white">{user.activeDeals}</div>
                <div className="text-sm text-gray-400">Active Deals</div>
              </div>
              <div className="bg-black/20 rounded-2xl p-6">
                <div className="text-2xl font-bold text-white">{user.completedDeals}</div>
                <div className="text-sm text-gray-400">Completed Deals</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Recent Transactions</h2>
              <Link 
                href="https://sepolia.etherscan.io/address/0x18949854C70C42DEFEE1066eb4ea226c0F9da9Ed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-500 hover:text-pink-400 text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Etherscan
              </Link>
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-xl border ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-white">{tx.product}</h3>
                          <span className="text-xl font-bold text-white">{tx.amount}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className={`ml-2 font-medium capitalize ${
                              tx.status === 'completed' ? 'text-green-400' :
                              tx.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-400">Participants:</span>
                            <span className="ml-2 text-white font-medium">{tx.participants}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-400">Time:</span>
                            <span className="ml-2 text-white">{tx.date}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-gray-400">Tx Hash:</span>
                          <span className="text-xs text-gray-500 font-mono">{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}</span>
                          <button 
                            onClick={() => copyToClipboard(tx.txHash)}
                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                          </button>
                          <Link
                            href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-500 hover:text-pink-400" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-16 text-center">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-800 p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to save more?
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Explore more bulk deals and join other buyers to unlock bigger savings on your favorite products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/products/electronics"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
                >
                  Browse Products
                </Link>
                <Link 
                  href="/categories"
                  className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
                >
                  View Categories
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}