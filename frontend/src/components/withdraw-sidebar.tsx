'use client';
import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader, ArrowLeft, DollarSign } from 'lucide-react';

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

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      setError('');
      
      // Withdraw logic will be implemented here
      console.log('Withdrawing from contract:', contractAddress);
      
      // Simulate withdraw process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Withdrawal successful! Your funds have been returned.');
      
      // Call success callback
      if (onWithdrawSuccess) {
        onWithdrawSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error withdrawing:', error);
      setError(error.message || 'Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const canWithdraw = !contractInfo.isFinalized && !isExpired;

  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6">
        <h3 className="text-xl font-semibold mb-4 text-orange-400">Withdraw from Campaign</h3>
        
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

        {/* Participation Status */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-semibold">You're Participating</span>
          </div>
          <p className="text-blue-200 text-sm">
            You have joined this campaign and deposited <strong>{contractInfo.priceETH}</strong>
          </p>
        </div>

        {/* Withdraw Information */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-orange-300 mb-2">Withdrawal Information</h4>
          <ul className="text-orange-200 text-sm space-y-1">
            <li>• You can withdraw before campaign ends</li>
            <li>• Your full deposit will be returned</li>
            <li>• You will no longer participate in the campaign</li>
            <li>• Withdrawal cannot be undone</li>
          </ul>
        </div>

        {/* Withdraw Amount Display */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Withdraw Amount:</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="font-semibold text-green-400">{contractInfo.priceETH}</span>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        {canWithdraw ? (
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {withdrawing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Withdrawing...
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Withdraw & Exit
              </>
            )}
          </button>
        ) : (
          <div className="text-center">
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h4 className="text-red-300 font-semibold mb-1">
                {contractInfo.isFinalized ? 'Campaign Completed' : 'Campaign Expired'}
              </h4>
              <p className="text-gray-400 text-sm">
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
          <div className="mt-4 text-xs text-gray-400 text-center">
            ⚠️ Warning: This action cannot be undone
          </div>
        )}
      </div>
    </div>
  );
}