'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { AlertTriangle, Loader } from 'lucide-react';

const { abi } = contractArtifact;

interface TestFinalizeButtonProps {
  contractAddress: string;
  onFinalizeSuccess?: () => void;
}

export default function TestFinalizeButton({ contractAddress, onFinalizeSuccess }: TestFinalizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFinalize = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Call the finalize function
      const tx = await contract.finalize();
      setSuccess(`Finalize transaction sent: ${tx.hash.substring(0, 10)}...`);
      
      // Wait for transaction to be mined
      await tx.wait();
      setSuccess('Campaign finalized successfully!');
      
      if (onFinalizeSuccess) {
        onFinalizeSuccess();
      }
    } catch (error: any) {
      console.error('Error finalizing campaign:', error);
      setError(error.message || 'Failed to finalize campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <h3 className="text-lg font-semibold text-red-400">Test Finalize Button</h3>
      </div>
      
      <p className="text-red-300 text-sm mb-4">
        ⚠️ <strong>TEST ONLY:</strong> This button calls the finalize function on the smart contract. 
        Use only for testing purposes. This action cannot be undone!
      </p>

      <button
        onClick={handleFinalize}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Finalizing...
          </>
        ) : (
          'Finalize Campaign (TEST)'
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}
    </div>
  );
}
