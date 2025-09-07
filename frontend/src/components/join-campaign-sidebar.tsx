'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { CheckCircle, AlertCircle, Loader, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import useUserStore from '../store/user';
import api from '../config/api';

const { abi } = contractArtifact;

interface JoinCampaignSidebarProps {
  contractAddress: string;
  contractInfo: {
    priceETH: string;
    isFinalized: boolean;
  };
  isExpired: boolean;
  onJoinSuccess?: () => void;
}

interface FormData {
  fullName: string;
  userAddress: string;
  phoneNumber: string;
}

export default function JoinCampaignSidebar({ 
  contractAddress, 
  contractInfo, 
  isExpired, 
  onJoinSuccess 
}: JoinCampaignSidebarProps) {
  const { user } = useUserStore();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    userAddress: '',
    phoneNumber: ''
  });
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePurchase = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is required!");
        return;
      }

      const { fullName, userAddress, phoneNumber } = formData;
      if (!fullName || !userAddress || !phoneNumber) {
        setError("Please fill in all fields!");
        return;
      }

      setPurchasing(true);
      setError('');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      console.log('Making purchase...');
      
      const price = await contract.price();
      console.log('Price:', ethers.formatEther(price), 'ETH');
      
      const tx = await contract.purchase({ value: price });
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Send purchase data to backend
      try {
        const signer = await provider.getSigner();
        const walletAddress = await signer.getAddress();
        
        const purchaseResponse = await api.post('/purchase', {
          contractId: contractAddress,
          walletAddress: walletAddress,
          name: fullName,
          address: userAddress,
          phoneNumber: phoneNumber
        });

        console.log('Purchase data saved to backend:', purchaseResponse.data);
      } catch (backendError) {
        console.error('Backend request failed:', backendError);
      }
      
      setSuccessMessage('Purchase successful! Welcome to the bulk buy group.');
      setFormData({ fullName: '', userAddress: '', phoneNumber: '' });
      
      // Call success callback
      if (onJoinSuccess) {
        onJoinSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error making purchase:', error);
      setError(error.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      {!user && (
        <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Join Campaign</h3>
          <div className="text-center">
            <div className="mb-4">
              <Users className="w-16 h-16 text-white mx-auto mb-3" />
              <p className="text-white mb-2">Connect your wallet to join this bulk buy campaign</p>
              <p className="text-gray-400 text-sm">Save money by purchasing together with others</p>
            </div>
            <Link 
              href="/login"
              className="inline-block w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      )}
      
      {user && !contractInfo.isFinalized && !isExpired && (
        <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Join this Campaign</h3>
          
          {error && (
            <div className="mb-4 bg-gray-800 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-gray-800 rounded-lg p-3 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Address *
              </label>
              <input
                type="text"
                name="userAddress"
                value={formData.userAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-3 text-sm">
              <p className="text-white">
                💰 You'll pay: <strong className="text-white">{contractInfo.priceETH}</strong>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Funds are locked until campaign finalization
              </p>
            </div>

            <button
              type="submit"
              disabled={purchasing}
              className="w-full py-3 bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {purchasing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Joining...
                </>
              ) : (
                `Join Campaign (${contractInfo.priceETH})`
              )}
            </button>

          </form>
        </div>
      )}

      {(contractInfo.isFinalized || isExpired) && (
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-center">
            {contractInfo.isFinalized ? (
              <>
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Campaign Completed</h3>
                <p className="text-gray-400">This bulk buy campaign has been finalized and payments have been processed.</p>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Campaign Expired</h3>
                <p className="text-gray-400">This bulk buy campaign period has ended. No new participants can join.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}