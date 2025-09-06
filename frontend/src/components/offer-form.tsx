'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import { Tag, DollarSign, Package, ExternalLink } from 'lucide-react';
import api from '../config/api';

const { abi } = contractArtifact;

interface OfferFormProps {
  contractAddress: string;
  onOfferSuccess?: () => void;
}

export default function OfferForm({ contractAddress, onOfferSuccess }: OfferFormProps) {
  const [formData, setFormData] = useState({
    price: '',
    productName: '',
    productLink: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!window.ethereum) {
        setError("MetaMask is required!");
        return;
      }

      const { price, productName, productLink } = formData;

      if (!price || !productName || !productLink) {
        setError("Please fill in all fields!");
        return;
      }

      if (!contractAddress) {
        setError("Contract address is required!");
        return;
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        setError("Please enter a valid price!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      console.log('Submitting offer...');
      
      const priceInWei = ethers.parseEther(price);
      
      // Get campaign price to send as payment
      const campaignPrice = await contract.price();
      console.log('Campaign Price:', ethers.formatEther(campaignPrice), 'ETH');
      
      const tx = await contract.submitOffer(priceInWei, productName, productLink, { 
        value: campaignPrice 
      });
      
      console.log('Transaction sent:', tx.hash);
      setSuccess(`Offer submitted! Transaction: ${tx.hash.slice(0, 10)}...`);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Send offer data to backend
      try {
        const signer = await provider.getSigner();
        const walletAddress = await signer.getAddress();
        
        const offerResponse = await api.post('/offer', {
          transactionId: contractAddress,
          wallet: walletAddress
        });

        console.log('Offer data saved to backend:', offerResponse.data);
      } catch (backendError) {
        console.error('Backend request failed:', backendError);
      }
      
      setSuccess('Offer submitted successfully! Campaign creator will review your offer.');

      // Clear form
      setFormData({
        price: '',
        productName: '',
        productLink: ''
      });

      // Call success callback
      if (onOfferSuccess) {
        onOfferSuccess();
      }

    } catch (error: any) {
      console.error('Error submitting offer:', error);
      if (error.message?.includes('Offer submission period has ended')) {
        setError('Offer period has ended! No more offers can be submitted.');
      } else if (error.message?.includes('You have already submitted an offer')) {
        setError('You have already submitted an offer for this campaign.');
      } else if (error.message?.includes('user rejected')) {
        setError('Transaction was cancelled by user.');
      } else {
        setError(error.message || 'Failed to submit offer. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Tag className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Submit Offer</h3>
            <p className="text-gray-400">Provide your competitive offer for this bulk purchase campaign</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmitOffer} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Offer Price (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            placeholder="0.002"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Enter your competitive price per item in ETH</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Package className="w-4 h-4 inline mr-2" />
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            placeholder="iPhone 15 Pro Max 256GB"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <ExternalLink className="w-4 h-4 inline mr-2" />
            Product Link
          </label>
          <input
            type="url"
            name="productLink"
            value={formData.productLink}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            placeholder="https://example.com/product"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Link to the product you're offering</p>
        </div>

        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-orange-300 mb-2">Important - Payment Required:</h4>
          <ul className="text-orange-200 text-sm space-y-1">
            <li>• You must pay the campaign price to submit your offer</li>
            <li>• Payment secures your participation in the campaign</li>
            <li>• If your offer is selected, you fulfill the order</li>
            <li>• If not selected, your payment will be refunded</li>
            <li>• You can withdraw before campaign finalization</li>
          </ul>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">Offer Guidelines:</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Submit your most competitive price</li>
            <li>• Ensure product matches campaign requirements</li>
            <li>• Provide accurate product information and links</li>
            <li>• Campaign creator will review and select the best offer</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Tag className="w-4 h-4" />
              Submit Offer & Pay
            </>
          )}
        </button>
      </form>
    </div>
  );
}