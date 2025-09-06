'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import useUserStore from '../../../store/user';

export default function CorporateLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const { setUser } = useUserStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        walletAddress: '',
        profilePhoto: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Clear error when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
        
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                setFormData({
                    ...formData,
                    walletAddress: accounts[0]
                });
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                // Login logic
                if (!formData.email || !formData.password) {
                    setError('Please enter email and password');
                    setIsLoading(false);
                    return;
                }

                // Call login API
                const response = await api.post('/login', {
                    email: formData.email,
                    password: formData.password
                });

                if (response.status === 200 || response.status === 201) {
                    const sellerData = response.data;
                    
                    // Update user store with seller information
                    setUser({
                        address: sellerData.wallet,
                        profilePhoto: sellerData.photoUrl,
                        name: sellerData.email.split('@')[0], // Use email prefix as name
                        email: sellerData.email
                    });

                    setSuccess('Login successful! Redirecting to homepage...');
                    
                    // Redirect to homepage after 1 second
                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                } else {
                    setError('Login failed. Please try again.');
                }
            } else {
                // Registration logic
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setIsLoading(false);
                    return;
                }

                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setIsLoading(false);
                    return;
                }

                if (!formData.walletAddress) {
                    setError('Please connect your wallet');
                    setIsLoading(false);
                    return;
                }

                // Call registration API
                const response = await api.post('/register', {
                    email: formData.email,
                    wallet: formData.walletAddress,
                    password: formData.password,
                    photoUrl: formData.profilePhoto || 'https://via.placeholder.com/150'
                });

                if (response.status === 201 || response.status === 200) {
                    setSuccess('Registration successful! Please log in to continue.');
                    // Switch to login tab after successful registration
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccess('Registration successful! Please log in to continue.');
                    }, 1500);
                } else {
                    setError('Registration failed. Please try again.');
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
            if (isLogin) {
                // Login error handling
                if (error.response?.status === 401) {
                    setError('Invalid email or password');
                } else if (error.response?.data?.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Login failed. Please try again.');
                }
            } else {
                // Registration error handling
                if (error.response?.data?.message) {
                    setError(error.response.data.message);
                } else if (error.response?.status === 409) {
                    setError('Email or wallet address already exists');
                } else {
                    setError('Registration failed. Please try again.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="text-3xl font-bold text-blue-500 mb-8 inline-block">
                        AllyBuy
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Account Login' : 'Create Account'}
                    </h2>
                    <p className="text-gray-400">
                        {isLogin 
                            ? 'Access your account with email and password' 
                            : 'Create your account to start bulk purchasing'
                        }
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                        <div className="text-red-400 text-sm">
                            <span className="font-semibold">Error:</span> {error}
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                        <div className="text-green-400 text-sm">
                            <span className="font-semibold">Success:</span> {success}
                        </div>
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="your@example.com"
                            />
                        </div>

                        {/* Registration Fields */}
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-2">
                                        MetaMask Wallet Address
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="walletAddress"
                                            name="walletAddress"
                                            type="text"
                                            required
                                            value={formData.walletAddress}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                            placeholder="Click connect to select wallet"
                                        />
                                        <button
                                            type="button"
                                            onClick={connectWallet}
                                            disabled={isConnecting}
                                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isConnecting ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                '🦊'
                                            )}
                                            {isConnecting ? 'Connecting...' : 'Connect'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Connect your MetaMask wallet to automatically fill your address
                                    </p>
                                    {formData.walletAddress && (
                                        <p className="text-xs text-green-400 mt-1">
                                            ✓ Wallet connected successfully
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-300 mb-2">
                                        Profile Photo URL
                                    </label>
                                    <input
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        type="url"
                                        value={formData.profilePhoto}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        placeholder="https://example.com/profile.jpg"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Optional: Add a profile photo URL (defaults to placeholder if empty)
                                    </p>
                                    {formData.profilePhoto && (
                                        <div className="mt-2">
                                            <img 
                                                src={formData.profilePhoto} 
                                                alt="Profile preview"
                                                className="object-contain w-12 h-12 rounded-full object-cover border border-gray-600"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirm Password (Registration only) */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                    </div>

                    {/* Remember me / Forgot password */}
                    {isLogin && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !!success}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Terms for registration */}
                    {!isLogin && (
                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                By creating an account, you agree to our{' '}
                                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* Toggle between login/register */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                {isLogin ? 'Register here' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                    {/* Alternative login options */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/login"
                                className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                            >
                                🔗 Connect with Web3 Wallet
                            </Link>
                        </div>
                    </div>
                </form>

                {/* Corporate Benefits */}
                <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Corporate Benefits</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            Volume discounts on bulk purchases
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            Priority seller matching
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            Dedicated account manager
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            Custom contract terms
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}