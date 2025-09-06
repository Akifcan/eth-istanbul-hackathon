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
    const [contractAddress, setContractAddress] = useState<string>('0x7DF7243B3B07393ca1236c43eAeec65440D657a6');
    const [participantInfo, setParticipantInfo] = useState<any>(null);

    const handleDeploy = async () => {

        try {

            if (!window.ethereum) {
                alert("Metamask gerekli!");
                return;
            }

            // Metamask provider
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const factory = new ethers.ContractFactory(abi, bytecode, signer);

            // Constructor parametreleri
            const endDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1 gün sonrası
            const maxParticipantCount = 50;
            const productId = 5;
            const productSlug = "iphone-16";
            const normalPrice = ethers.parseEther("0.002"); // 0.002 ETH normal price
            const discountedPrice = ethers.parseEther("0.001"); // 0.001 ETH discounted price

            console.log("START")

            const contract = await factory.deploy(endDate, maxParticipantCount, productId, productSlug, normalPrice, discountedPrice);

            await contract.waitForDeployment();

            const address = await contract.getAddress();
            setContractAddress(address);
            console.log('Contract deployed at:', address);

        } catch (e) {
            console.log(e)
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
                contractProductId: result[3],
                contractProductSlug: result[4],
                normalPriceETH: result[5],
                discountedPriceETH: result[6]
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

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddr, abi, signer);

            console.log('Making purchase with discounted price...');
            
            const discountedPrice = await contract.discountedPrice();
            
            console.log('Discounted price:', ethers.formatEther(discountedPrice), 'ETH');
            
            const tx = await contract.purchase({ value: discountedPrice });
            
            console.log('Transaction sent:', tx.hash);
            alert(`Transaction sent: ${tx.hash}`);
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            alert('Purchase successful!');

            await getParticipantInfo(contractAddr);

        } catch (error: any) {
            console.error('Error making purchase:', error);
            alert(`Purchase failed: ${error.message || error}`);
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
                    <button 
                        onClick={handleDeploy}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
                    >
                        Deploy Contract
                    </button>
                    
                    {contractAddress && (
                        <>
                            <div className="mt-4">
                                <p className="text-green-600">✅ Contract deployed at:</p>
                                <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-4">
                                    {contractAddress}
                                </p>
                                <button 
                                    onClick={() => getParticipantInfo(contractAddress)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
                                >
                                    Get Participant Info
                                </button>
                                
                                <div className="mt-4">
                                    <h4 className="font-bold mb-2">Make Purchase:</h4>
                                    <div className="flex gap-2">
                                       
                                        <button 
                                            onClick={() => handlePurchase(contractAddress)}
                                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {participantInfo && (
                        <div className="mt-4 bg-gray-100 p-4 rounded">
                            <h3 className="font-bold mb-2">Participant Info:</h3>
                            <p>Current Participants: {participantInfo.currentParticipants}</p>
                            <p>Max Participants: {participantInfo.maxParticipants}</p>
                            <p>End Date: {new Date(parseInt(participantInfo.contractEndDate) * 1000).toLocaleString()}</p>
                            <p>Product ID: {participantInfo.contractProductId}</p>
                            <p>Product Slug: {participantInfo.contractProductSlug}</p>
                            <p className="text-red-600">Normal Price: {participantInfo.normalPriceETH}</p>
                            <p className="text-green-600">Discounted Price: {participantInfo.discountedPriceETH}</p>
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