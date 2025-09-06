'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { CheckCircle, AlertCircle, Loader, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import useUserStore from '../store/user';

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
      
      const tx = await contract.purchase(fullName, userAddress, phoneNumber, { value: price });
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
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
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6">
          <h3 className="text-xl font-semibold mb-4">Join Campaign</h3>
          <div className="text-center">
            <div className="mb-4">
              <Users className="w-16 h-16 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-300 mb-2">Connect your wallet to join this bulk buy campaign</p>
              <p className="text-gray-500 text-sm">Save money by purchasing together with others</p>
            </div>
            <Link 
              href="/login"
              className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      )}
      
      {user && !contractInfo.isFinalized && !isExpired && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6">
          <h3 className="text-xl font-semibold mb-4">Join this Campaign</h3>
          
          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="userAddress"
                value={formData.userAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-sm">
              <p className="text-blue-200">
                💰 You'll pay: <strong className="text-blue-300">{contractInfo.priceETH}</strong>
              </p>
              <p className="text-blue-200 text-xs mt-1">
                Funds are locked until campaign finalization
              </p>
            </div>

            <button
              type="submit"
              disabled={purchasing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-center">
            {contractInfo.isFinalized ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-400">Campaign Completed</h3>
                <p className="text-gray-400">This bulk buy campaign has been finalized and payments have been processed.</p>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-red-400">Campaign Expired</h3>
                <p className="text-gray-400">This bulk buy campaign period has ended. No new participants can join.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}