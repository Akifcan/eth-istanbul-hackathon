'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { Package, ExternalLink, Wallet, DollarSign, Loader, AlertCircle } from 'lucide-react';

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
}

export default function OffersList({ contractAddress, refreshTrigger }: OffersListProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getOffers = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      console.log('Getting offers...');
      const result = await contract.getOffers();
      setOffers(result);
      console.log('Offers:', result);
      
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
        * Offers are sorted by submission order. Campaign creator will select the best offer.
      </div>
    </div>
  );
}