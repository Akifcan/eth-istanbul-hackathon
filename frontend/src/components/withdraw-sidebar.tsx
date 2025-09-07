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
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 sticky top-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Withdraw from Campaign
            </h3>
            <p className="text-slate-400 text-sm">Exit this campaign</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-red-300 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-green-300 font-medium text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Participation Status */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-blue-300 font-semibold text-lg">You're Participating</span>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            You have joined this campaign and deposited <span className="font-bold text-blue-100">{contractInfo.priceETH}</span>
          </p>
        </div>

        {/* Withdraw Information */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-orange-400" />
            </div>
            <h4 className="font-semibold text-orange-300 text-lg">Withdrawal Information</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-orange-200 text-sm">You can withdraw before campaign ends</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-orange-200 text-sm">Your full deposit will be returned</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-orange-200 text-sm">You will no longer participate in the campaign</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-red-200 text-sm font-medium">Withdrawal cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Withdraw Amount Display */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 rounded-xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-300 text-sm font-medium">Withdraw Amount</span>
              <p className="text-slate-400 text-xs mt-1">Full deposit will be returned</p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/30">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-bold text-green-400 text-lg">{contractInfo.priceETH}</span>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        {canWithdraw ? (
          <button
            onClick={handleWithdrawClick}
            disabled={withdrawing}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/25 disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
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
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-red-300 font-bold text-lg mb-2">
                {contractInfo.isFinalized ? 'Campaign Completed' : 'Campaign Expired'}
              </h4>
              <p className="text-red-200 text-sm leading-relaxed">
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
            <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/30">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-slate-400 text-xs font-medium">This action cannot be undone</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Confirm Withdrawal
                </h3>
              </div>
              <button
                onClick={handleCancelWithdraw}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="text-orange-300 font-bold text-lg mb-3">Are you sure?</h4>
                  <p className="text-orange-200 text-sm leading-relaxed">
                    You are about to withdraw from this campaign. This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-slate-300 text-sm font-medium">Withdraw Amount</span>
                    <p className="text-slate-400 text-xs mt-1">Full deposit will be returned</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="font-bold text-green-400 text-lg">{contractInfo.priceETH}</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You will receive your full deposit back and will no longer participate in this campaign.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleCancelWithdraw}
                className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 transform hover:scale-[1.02]"
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