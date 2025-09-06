'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";
import useUserStore from '../../store/user';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, ArrowLeft, Copy } from 'lucide-react';
import api from '@/config/api';
import Link from 'next/link';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const { abi, bytecode } = contractArtifact;

type DeploymentState = 'idle' | 'deploying' | 'success' | 'error';

export default function Create() {
    const { user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if(user){
            return
        }
        router.push('/login')
    }, [user])
    
    
    const [deploymentState, setDeploymentState] = useState<DeploymentState>('idle');
    const [transactionHash, setTransactionHash] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    
    const [formData, setFormData] = useState({
        contractTitle: '',
        contractDescription: '',
        maxParticipantCount: '',
        contractPrice: '',
        creatorName: '',
        creatorAddress: '',
        creatorPhone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleDeploy = async () => {
        try {
            if (!user) {
                alert("Please connect your wallet first!");
                router.push('/login');
                return;
            }

            if (!window.ethereum) {
                alert("MetaMask is required!");
                return;
            }

            const { contractTitle, contractDescription, maxParticipantCount, contractPrice } = formData;

            if (!contractTitle || !contractDescription || !maxParticipantCount || !contractPrice) {
                alert("Please fill in all contract fields!");
                return;
            }

            // Address fields are still collected for UI purposes but not required for contract

            const participantCount = parseInt(maxParticipantCount);
            if (isNaN(participantCount) || participantCount < 2) {
                alert("Maximum participant count must be at least 2!");
                return;
            }

            const priceNum = parseFloat(contractPrice);
            if (isNaN(priceNum) || priceNum <= 0) {
                alert("Please enter a valid price!");
                return;
            }

            setDeploymentState('deploying');
            setErrorMessage('');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const factory = new ethers.ContractFactory(abi, bytecode, signer);
            const price = ethers.parseEther(contractPrice);

            const contract = await factory.deploy(
                participantCount, 
                price, 
                contractTitle,
                contractDescription,
                { value: price }
            );

            const txHash = contract.deploymentTransaction()?.hash || '';
            setTransactionHash(txHash);
            
            await contract.waitForDeployment();
            
            const address = await contract.getAddress();
            setContractAddress(address);

            // Send to backend API
            try {
                await api.post('/campaigns', {
                    transaction: address,
                    createdWallet: user.address
                });
            } catch (error) {
                console.error('Failed to save campaign to backend:', error);
            }

            setDeploymentState('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Clear form
            setFormData({
                contractTitle: '',
                contractDescription: '',
                maxParticipantCount: '',
                contractPrice: '',
                creatorName: '',
                creatorAddress: '',
                creatorPhone: ''
            });

        } catch (error: any) {
            console.error('Deployment failed:', error);
            setErrorMessage(error.message || 'Deployment failed. Please try again.');
            setDeploymentState('error');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetState = () => {
        setDeploymentState('idle');
        setTransactionHash('');
        setContractAddress('');
        setErrorMessage('');
    };

    // Deploying state - Full screen loader
    if (deploymentState === 'deploying') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center space-y-8 max-w-md">
                    <div className="relative">
                        <div className="w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-blue-400">Creating Your Contract</h2>
                        <p className="text-gray-400 text-lg">
                            Deploying contract to blockchain, please wait...
                        </p>
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-yellow-300 text-sm">
                                ⚠️ This may take a few minutes. Do not close this page.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Transaction Hash:</span>
                            <span className="text-blue-400 font-mono">
                                {transactionHash ? `${transactionHash.slice(0, 10)}...` : 'Generating...'}
                            </span>
                        </div>
                        {transactionHash && (
                            <a
                                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline block"
                            >
                                View on Etherscan
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (deploymentState === 'success') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                    
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Contract Created Successfully!</h1>
                        <p className="text-gray-400 text-lg">
                            Your bulk purchase contract has been deployed to the blockchain.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold mb-3 text-green-400">Contract Address</h3>
                            <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-3">
                                <code className="text-sm font-mono flex-1 text-blue-300">
                                    {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(contractAddress)}
                                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                                    title="Copy full address"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <a
                                    href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                                >
                                    View on Etherscan
                                </a>
                            </div>
                            {isCopied && (
                                <p className="text-green-400 text-sm mt-2">✓ Copied to clipboard!</p>
                            )}
                        </div>

                        {transactionHash && (
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold mb-3 text-blue-400">Transaction Hash</h3>
                                <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-3">
                                    <code className="text-sm font-mono flex-1 text-purple-300">
                                        {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(transactionHash)}
                                        className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                                        title="Copy full transaction hash"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 text-sm underline"
                                    >
                                        View on Etherscan
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/campaign/${contractAddress}`}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors inline-block text-center"
                        >
                            View Campaign
                        </Link>
                        <button
                            onClick={resetState}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                        >
                            Create Another Contract
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors inline-block text-center"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to home
                        </Link>
                        <h1 className="text-4xl font-bold mb-4">Create Contract</h1>
                        <p className="text-gray-400 text-lg">
                            Set up a new bulk purchase contract and invite others to join.
                        </p>
                    </div>

                    {/* Error State */}
                    {deploymentState === 'error' && (
                        <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-400">Deployment Failed</h3>
                                <p className="text-red-300 text-sm mt-1">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={(e) => { e.preventDefault(); handleDeploy(); }} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Contract Title *
                                </label>
                                <input
                                    type="text"
                                    name="contractTitle"
                                    value={formData.contractTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="iPhone 15 Bulk Purchase"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Max Participants *
                                </label>
                                <input
                                    type="number"
                                    name="maxParticipantCount"
                                    value={formData.maxParticipantCount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="10"
                                    min="2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="contractDescription"
                                value={formData.contractDescription}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Looking to buy iPhone 15 Pro Max 256GB in bulk. The more people join, the better price we can negotiate..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price per Item (ETH) *
                            </label>
                            <input
                                type="number"
                                name="contractPrice"
                                value={formData.contractPrice}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="0.002"
                                step="0.001"
                                min="0"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                This amount will be locked from each participant
                            </p>
                        </div>

                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Creator Information <span className="text-sm font-normal text-gray-500">(Optional)</span></h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="creatorName"
                                        value={formData.creatorName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="creatorPhone"
                                        value={formData.creatorPhone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="creatorAddress"
                                    value={formData.creatorAddress}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="123 Main Street, City, Country"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-300 mb-2">Important Notes:</h4>
                            <ul className="text-blue-200 text-sm space-y-1">
                                <li>• You will pay the specified amount to create this contract</li>
                                <li>• Contract will be active for 7 days</li>
                                <li>• Sellers can submit offers during this period</li>
                                <li>• The lowest offer wins when finalized</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                        >
                            {`Create Contract ${formData.contractPrice ? `(Pay ${formData.contractPrice} ETH)` : ''}`}
                        </button>

                        {!user && (
                            <p className="text-center text-red-400 text-sm">
                                Please <Link href="/login" className="underline">connect your wallet</Link> to create a contract
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}