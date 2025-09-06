'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractArtifact from "@/contract/BuyItem/BuyItem.json";

declare global {
    interface Window {
        ethereum?: any;
    }
}

const { abi, bytecode } = contractArtifact;

export default function Demo() {
    const [account, setAccount] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>('0x2D868Cc128fdA4EA9C33C7d0C5dE146528d38487');
    const [participantInfo, setParticipantInfo] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [fullName, setFullName] = useState<string>('');
    const [userAddress, setUserAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [creatorName, setCreatorName] = useState<string>('');
    const [creatorAddress, setCreatorAddress] = useState<string>('');
    const [creatorPhone, setCreatorPhone] = useState<string>('');
    const [contractTitle, setContractTitle] = useState<string>('');
    const [contractDescription, setContractDescription] = useState<string>('');
    const [maxParticipantCount, setMaxParticipantCount] = useState<string>('');
    const [contractPrice, setContractPrice] = useState<string>('');

    const handleDeploy = async () => {
        try {
            if (!window.ethereum) {
                alert("Metamask gerekli!");
                return;
            }

            if (!contractTitle || !contractDescription || !maxParticipantCount || !contractPrice || !creatorName || !creatorAddress || !creatorPhone) {
                alert("Lütfen tüm bilgileri doldurun!");
                return;
            }

            const participantCount = parseInt(maxParticipantCount);
            if (isNaN(participantCount) || participantCount < 2) {
                alert("Max katılımcı sayısı en az 2 olmalıdır!");
                return;
            }

            const priceNum = parseFloat(contractPrice);
            if (isNaN(priceNum) || priceNum <= 0) {
                alert("Geçerli bir fiyat girin!");
                return;
            }

            // Metamask provider
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const factory = new ethers.ContractFactory(abi, bytecode, signer);

            // Constructor parametreleri - yeni contract yapısına göre
            const price = ethers.parseEther(contractPrice);

            console.log("Deploying contract with creator info...");

            const contract = await factory.deploy(
                participantCount, 
                price, 
                contractTitle,
                contractDescription,
                creatorName, 
                creatorAddress, 
                creatorPhone,
                { value: price } // Contract creator must pay the price
            );

            await contract.waitForDeployment();

            const address = await contract.getAddress();
            setContractAddress(address);
            console.log('Contract deployed at:', address);

            // Clear creator form
            setContractTitle('');
            setContractDescription('');
            setMaxParticipantCount('');
            setContractPrice('');
            setCreatorName('');
            setCreatorAddress('');
            setCreatorPhone('');

            alert(`Contract deployed successfully at: ${address}`);

        } catch (e) {
            console.error('Deployment failed:', e);
            alert(`Deployment failed: ${e}`);
        }
    }

    const getParticipantInfo = async (contractAddr: string) => {
        try {
            if (!window.ethereum) {
                alert("MetaMask gerekli!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddr, abi, provider);

            console.log('Calling getParticipantInfo...');
            const result = await contract.getParticipantInfo();
            
            const info = {
                currentParticipants: result[0],
                maxParticipants: result[1],
                contractEndDate: result[2].toString(),
                priceETH: result[3],
                contractTitle: result[4],
                contractDescription: result[5]
            };

            console.log('Participant Info:', info);
            setParticipantInfo(info);

        } catch (error) {
            console.error('Error getting participant info:', error);
            alert('Failed to get participant info');
        }
    };

    const handlePurchase = async (contractAddr: string) => {
        try {
            if (!window.ethereum) {
                alert("MetaMask gerekli!");
                return;
            }

            if (!fullName || !userAddress || !phoneNumber) {
                alert("Lütfen tüm bilgileri doldurun!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddr, abi, signer);

            console.log('Making purchase...');
            
            const price = await contract.price();
            
            console.log('Price:', ethers.formatEther(price), 'ETH');
            
            const tx = await contract.purchase(fullName, userAddress, phoneNumber, { value: price });
            
            console.log('Transaction sent:', tx.hash);
            alert(`Transaction sent: ${tx.hash}`);
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            alert('Purchase successful!');

            // Clear form
            setFullName('');
            setUserAddress('');
            setPhoneNumber('');

            await getParticipantInfo(contractAddr);

        } catch (error: any) {
            console.error('Error making purchase:', error);
            alert(`Purchase failed: ${error.message || error}`);
        }
    };

    const getOffers = async (contractAddr: string) => {
        try {
            if (!window.ethereum) {
                alert("MetaMask gerekli!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddr, abi, provider);

            console.log('Getting offers...');
            const result = await contract.getOffers();
            setOffers(result);
            console.log('Offers:', result);

        } catch (error) {
            console.error('Error getting offers:', error);
            alert('Failed to get offers');
        }
    };

    const getAllPurchases = async (contractAddr: string) => {
        try {
            if (!window.ethereum) {
                alert("MetaMask gerekli!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddr, abi, provider);

            console.log('Getting all purchases...');
            const result = await contract.getAllPurchases();
            setPurchases(result);
            console.log('All Purchases:', result);

        } catch (error) {
            console.error('Error getting purchases:', error);
            alert('Failed to get purchases');
        }
    };

    const submitOffer = async (contractAddr: string, price: string, productName: string, productLink: string) => {
        try {
            if (!window.ethereum) {
                alert("MetaMask gerekli!");
                return;
            }

            if (!price || !productName || !productLink) {
                alert("Lütfen tüm teklif bilgilerini doldurun!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddr, abi, signer);

            console.log('Submitting offer...');
            
            const priceInWei = ethers.parseEther(price);
            const tx = await contract.submitOffer(priceInWei, productName, productLink);
            
            console.log('Transaction sent:', tx.hash);
            alert(`Offer submitted: ${tx.hash}`);
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            alert('Offer submitted successfully!');

            await getOffers(contractAddr);

        } catch (error: any) {
            console.error('Error submitting offer:', error);
            alert(`Offer submission failed: ${error.message || error}`);
        }
    };



    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }

        setIsConnecting(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            setAccount(accounts[0]);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount('');
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0].address);
                }
            }
        };
        checkConnection();
    }, []);

    if (account) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Demo - Wallet Connected</h1>
                <div className="space-y-4">
                    <p className="text-green-600">✅ Connected Account:</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {account}
                    </p>
                    <button
                        onClick={disconnectWallet}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Disconnect Wallet
                    </button>
                    
                    <div className="mt-4 bg-gray-800 p-4 rounded">
                        <h4 className="font-bold mb-2 text-white">Deploy New Contract:</h4>
                        <div className="space-y-2 mb-4">
                            <input
                                type="text"
                                placeholder="Contract Title"
                                value={contractTitle}
                                onChange={(e) => setContractTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <textarea
                                placeholder="Contract Description"
                                value={contractDescription}
                                onChange={(e) => setContractDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <input
                                type="number"
                                placeholder="Max Participant Count (min: 2)"
                                value={maxParticipantCount}
                                onChange={(e) => setMaxParticipantCount(e.target.value)}
                                min="2"
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <input
                                type="number"
                                placeholder="Price (ETH) - e.g., 0.002"
                                value={contractPrice}
                                onChange={(e) => setContractPrice(e.target.value)}
                                step="0.001"
                                min="0"
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Creator Full Name"
                                value={creatorName}
                                onChange={(e) => setCreatorName(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Creator Address"
                                value={creatorAddress}
                                onChange={(e) => setCreatorAddress(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Creator Phone Number"
                                value={creatorPhone}
                                onChange={(e) => setCreatorPhone(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                            />
                            <button 
                                onClick={handleDeploy}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={!contractTitle || !contractDescription || !maxParticipantCount || !contractPrice || !creatorName || !creatorAddress || !creatorPhone}
                            >
                                Deploy Contract (Pay {contractPrice || '0'} ETH)
                            </button>
                        </div>
                    </div>
                    
                    {contractAddress && (
                        <>
                            <div className="mt-4">
                                <p className="text-green-600">✅ Contract deployed at:</p>
                                <p className="font-mono text-sm bg-gray-800 text-white p-2 rounded mb-4">
                                    {contractAddress}
                                </p>
                                <button 
                                    onClick={() => getParticipantInfo(contractAddress)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
                                >
                                    Get Participant Info
                                </button>
                                
                                <div className="mt-4 bg-gray-800 p-4 rounded">
                                    <h4 className="font-bold mb-2 text-white">Make Purchase:</h4>
                                    <div className="space-y-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            value={userAddress}
                                            onChange={(e) => setUserAddress(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                                        />
                                        <button 
                                            onClick={() => handlePurchase(contractAddress)}
                                            className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                            disabled={!fullName || !userAddress || !phoneNumber}
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button 
                                        onClick={() => getOffers(contractAddress)}
                                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-4"
                                    >
                                        Get Offers
                                    </button>
                                    <button 
                                        onClick={() => getAllPurchases(contractAddress)}
                                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                    >
                                        Get All Purchases
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {participantInfo && (
                        <div className="mt-4 bg-gray-800 p-4 rounded">
                            <h3 className="font-bold mb-2 text-white">Contract Info:</h3>
                            <p className="text-white"><strong>Title:</strong> {participantInfo.contractTitle}</p>
                            <p className="text-white"><strong>Description:</strong> {participantInfo.contractDescription}</p>
                            <p className="text-white">Current Participants: {participantInfo.currentParticipants}</p>
                            <p className="text-white">Max Participants: {participantInfo.maxParticipants}</p>
                            <p className="text-white">End Date: {new Date(parseInt(participantInfo.contractEndDate) * 1000).toLocaleString()}</p>
                            <p className="text-blue-400">Price: {participantInfo.priceETH}</p>
                        </div>
                    )}

                    {offers.length > 0 && (
                        <div className="mt-4 bg-gray-800 p-4 rounded">
                            <h3 className="font-bold mb-2 text-white">Offers ({offers.length}):</h3>
                            <div className="space-y-2">
                                {offers.map((offer: any, index: number) => (
                                    <div key={index} className="bg-gray-700 p-3 rounded border border-gray-600">
                                        <p className="text-white"><strong>Price:</strong> {ethers.formatEther(offer.price)} ETH</p>
                                        <p className="text-white"><strong>Product:</strong> {offer.productName}</p>
                                        <p className="text-white"><strong>Link:</strong> <a href={offer.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{offer.productLink}</a></p>
                                        <p className="text-white"><strong>Seller:</strong> {offer.walletAddress}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {purchases.length > 0 && (
                        <div className="mt-4 bg-gray-800 p-4 rounded">
                            <h3 className="font-bold mb-2 text-white">All Purchases ({purchases.length}):</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {purchases.map((purchase: any, index: number) => (
                                    <div key={index} className="bg-gray-700 p-3 rounded border border-gray-600">
                                        <p className="text-white"><strong>Amount:</strong> {ethers.formatEther(purchase.amount)} ETH</p>
                                        <p className="text-white"><strong>Name:</strong> {purchase.fullName}</p>
                                        <p className="text-white"><strong>Address:</strong> {purchase.userAddress}</p>
                                        <p className="text-white"><strong>Phone:</strong> {purchase.phoneNumber}</p>
                                        <p className="text-white"><strong>Date:</strong> {new Date(parseInt(purchase.timestamp) * 1000).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Demo - Connect Wallet</h1>
            <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
        </div>
    );
}