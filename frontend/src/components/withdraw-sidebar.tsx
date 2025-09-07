'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { CheckCircle, AlertCircle, Loader, ArrowLeft, DollarSign, X } from 'lucide-react';

const { abi } = contractArtifact;

interface WithdrawSidebarProps {
  contractAddress: string;
  contractInfo: {
    priceETH: string;
    isFinalized: boolean;
  };
  isExpired: boolean;
  onWithdrawSuccess?: () => void;
}

export default function WithdrawSidebar({ 
  contractAddress, 
  contractInfo, 
  isExpired, 
  onWithdrawSuccess 
}: WithdrawSidebarProps) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleWithdrawClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      setWithdrawing(true);
      setError('');
      setShowConfirmModal(false);
      
      if (!window.ethereum) {
        setError("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      console.log('Withdrawing from contract...');
      
      const tx = await contract.withdraw();
      
      console.log('Transaction sent:', tx.hash);
      setSuccessMessage(`Withdraw transaction sent ${tx.hash.substring(0, 4)}...`);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      setSuccessMessage('Withdraw successful! Your money has been returned.');
      
      // Call success callback
      if (onWithdrawSuccess) {
        onWithdrawSuccess();
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error: any) {
      console.error('Error withdrawing:', error);
      setError(error.message || 'Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleCancelWithdraw = () => {
    setShowConfirmModal(false);
  };

  const canWithdraw = !contractInfo.isFinalized && !isExpired;

  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-900 rounded-2xl p-6 sticky top-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Withdraw from Campaign
            </h3>
            <p className="text-gray-400 text-sm">Exit this campaign</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-gray-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-gray-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Participation Status */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">You're Participating</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            You have joined this campaign and deposited <span className="font-bold text-white">1000 USDT</span>
          </p>
        </div>

        {/* Withdraw Information */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-white text-lg">Withdrawal Information</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-400 text-sm">You can withdraw before campaign ends</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-400 text-sm">Your full deposit will be returned</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-400 text-sm">You will no longer participate in the campaign</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white text-sm font-medium">Withdrawal cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Withdraw Amount Display */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">Withdraw Amount</span>
              <p className="text-gray-400 text-xs mt-1">Full deposit will be returned</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-lg">1000 USDT</span>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        {canWithdraw ? (
          <button
            onClick={handleWithdrawClick}
            disabled={withdrawing}
            className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:transform-none"
          >
            {withdrawing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Withdrawing...</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>Withdraw & Exit</span>
              </>
            )}
          </button>
        ) : (
          <div className="text-center">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">
                {contractInfo.isFinalized ? 'Campaign Completed' : 'Campaign Expired'}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {contractInfo.isFinalized 
                  ? 'The campaign has been finalized. Withdrawals are no longer available.' 
                  : 'The campaign period has ended. Withdrawals are no longer available.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Warning */}
        {canWithdraw && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-xs font-medium">This action cannot be undone</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Confirm Withdrawal
                </h3>
              </div>
              <button
                onClick={handleCancelWithdraw}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-8">
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-3">Are you sure?</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    You are about to withdraw from this campaign. This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-white text-sm font-medium">Withdraw Amount</span>
                    <p className="text-gray-400 text-xs mt-1">Full deposit will be returned</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                    <span className="font-bold text-white text-lg">{contractInfo.priceETH}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  You will receive your full deposit back and will no longer participate in this campaign.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleCancelWithdraw}
                className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="flex-1 py-3 px-6 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}