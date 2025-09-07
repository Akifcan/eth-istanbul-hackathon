'use client';
import api from '@/config/api';
import { ethers } from 'ethers';
import { Wallet, DollarSign, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Offer {
  price: bigint;
  productName: string;
  productLink: string;
  walletAddress: string;
  companyId: string;
}

interface OfferRowProps {
  offer: Offer;
  index: number;
}

interface Seller {
  id: number;
  name: string;
  photoUrl: string;
  email: string;
}

export default function OfferRow({ offer, index }: OfferRowProps) {
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await api.get(`/seller/${offer.companyId}`);
        console.log('Seller data:', response.data);
        setSeller(response.data);
      } catch (error) {
        console.error('Error fetching seller:', error);
      }
    };

    fetchSeller();
  }, [offer.companyId]);

  return (
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
        <div className="flex flex-col items-center gap-3">
          {seller?.photoUrl && (
            <img 
              src={seller.photoUrl} 
              alt={seller.name}
              className="w-12 h-12 rounded-full object-contain"
            />
          )}
          <div>
            <div className="font-medium text-white" style={{whiteSpace: 'nowrap'}}>{seller?.name || 'Loading...'}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="font-medium text-white">{offer.productName}</div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold">

            {(parseFloat(ethers.formatEther(offer.price)) * 4500 * 200).toFixed(2)} USDT

          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <a
          href={offer.productLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Product
        </a>
      </td>
    </tr>
  );
}
