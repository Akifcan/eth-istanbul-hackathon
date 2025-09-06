'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { Package, ExternalLink, Wallet, DollarSign, Loader, AlertCircle, Clock, Trophy } from 'lucide-react';

const { abi } = contractArtifact;

interface Offer {
  price: bigint;
  productName: string;
  productLink: string;
  walletAddress: string;
}

interface OffersListProps {
  contractAddress: string;
  refreshTrigger?: number;
  campaignEndTime?: string; // Campaign end time for timer
}

export default function OffersList({ contractAddress, refreshTrigger, campaignEndTime }: OffersListProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Timer function - Calculate difference between campaign end time and now
  const updateTimer = () => {
    if (!campaignEndTime) {
      setTimeLeft('00d 00h 00m 00s');
      return;
    }
    // Parse Unix timestamp (seconds since epoch)
    const endTime = parseInt(campaignEndTime) * 1000; // Convert to milliseconds
    const now = new Date().getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setIsUrgent(hours === 0 && minutes < 60);
      setTimeLeft(`${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    } else {
      setTimeLeft('00d 00h 00m 00s');
      setIsUrgent(true);
    }
  };

  const getOffers = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

     
      const result = await contract.getOffers();
      
      // Sort offers by price (lowest first)
      const sortedOffers = [...result].sort((a: Offer, b: Offer) => {
        return Number(a.price - b.price);
      });
      
      setOffers(sortedOffers);
      
    } catch (error) {
      console.error('Error getting offers:', error);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      getOffers();
    }
  }, [contractAddress, refreshTrigger]);

  // Timer effect - Always run timer
  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [campaignEndTime]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Submitted Offers</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-3 text-gray-400">Loading offers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Submitted Offers</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <span className="ml-3 text-red-400">{error}</span>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Submitted Offers</h3>
        </div>
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-300 mb-2">No Offers Yet</h4>
          <p className="text-gray-500">No companies have submitted offers for this campaign yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Best Offer Card */}
      {offers.length > 0 && (
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Best Offer</h3>
            </div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 ${
              isUrgent 
                ? 'bg-red-900/30 border-red-500/30' 
                : 'bg-orange-900/30 border-orange-500/30'
            }`}>
              <Clock className={`w-6 h-6 animate-pulse ${
                isUrgent ? 'text-red-400' : 'text-orange-400'
              }`} />
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  isUrgent ? 'text-red-300' : 'text-orange-300'
                }`}>
                  {timeLeft === '00d 00h 00m 00s' ? 'Campaign Ended' : 'Time Remaining'}
                </div>
                <div className={`text-2xl font-bold font-mono tracking-wider ${
                  isUrgent ? 'text-red-400' : 'text-orange-400'
                }`}>
                  {timeLeft || '00d 00h 00m 00s'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Company</p>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <code className="text-sm bg-gray-700 px-2 py-1 rounded font-mono">
                  {offers[0].walletAddress.slice(0, 6)}...{offers[0].walletAddress.slice(-4)}
                </code>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Product</p>
              <p className="font-medium text-white">{offers[0].productName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Price</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">
                  {ethers.formatEther(offers[0].price)} ETH
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> If no lower offer is received within the remaining time, 
              you will purchase at this price. This is the best deal currently available!
            </p>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Submitted Offers ({offers.length})</h3>
        </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-300">Company</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Price (ETH)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, index) => (
              <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <code className="text-sm bg-gray-700 px-2 py-1 rounded font-mono">
                      {offer.walletAddress.slice(0, 6)}...{offer.walletAddress.slice(-4)}
                    </code>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-white">{offer.productName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="font-semibold text-green-400">
                      {ethers.formatEther(offer.price)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <a
                    href={offer.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Product
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
        <div className="mt-4 text-sm text-gray-400">
          * Offers are sorted by price (lowest first). Campaign creator will select the best offer.
        </div>
      </div>
    </div>
  );
}