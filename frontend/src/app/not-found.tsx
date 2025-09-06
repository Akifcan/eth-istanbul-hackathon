'use client';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
                </div>
                
                <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Oops! The page you're looking for seems to have vanished into the blockchain. 
                    Don't worry, our smart contracts are still working perfectly!
                </p>
                
                <div className="space-y-4 mb-8">
                    <p className="text-gray-300">Here are some things you can try:</p>
                    <ul className="text-gray-400 space-y-2">
                        <li>• Check the URL for any typos</li>
                        <li>• Go back to the homepage</li>
                        <li>• Explore our bulk buying contracts</li>
                        <li>• Connect your wallet and start shopping</li>
                    </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
                    >
                        Back to Home
                    </Link>
                    <Link 
                        href="/demo"
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
                    >
                        Try Demo
                    </Link>
                </div>
                
                <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">
                        Join the AllyBuy Community
                    </h3>
                    <p className="text-gray-400 mb-4">
                        While you're here, why not explore our Web3 marketplace for bulk purchases?
                    </p>
                    <div className="flex justify-center space-x-6 text-sm text-gray-500">
                        <span>🛒 Bulk Buying</span>
                        <span>⛓️ Blockchain Secure</span>
                        <span>💰 Save Money</span>
                    </div>
                </div>
            </div>
        </div>
    );
}