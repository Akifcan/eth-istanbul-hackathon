'use client';

import { useState } from 'react';
import { Menu, X, User, Wallet, Plus, LogOut, Tag } from 'lucide-react';
import Link from 'next/link';
import useUserStore from '../store/user';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useUserStore();
  
  // Check if user is corporate (has profilePhoto, name, and email)
  const isCorporateUser = user && user.profilePhoto && user.name && user.email;


  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              AllyBuy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Logged in user actions
              <>
                {/* Create Contract Button - Only for non-corporate users */}
                {!isCorporateUser && (
                  <Link href="/create" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300">
                    <Plus className="w-4 h-4" />
                    Create Contract
                  </Link>
                )}

                {isCorporateUser ? (
                  // Corporate User - Offers Button & Logout
                  <>
                    <Link 
                      href="/my-offers" 
                      className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300"
                    >
                      <Tag className="w-4 h-4" />
                      Offers
                    </Link>
                    <button
                      onClick={logout}
                      className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  // Regular User - Profile Dropdown
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-fit"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="hidden md:block text-white text-sm font-medium">
                        {user.name || `${user.address.slice(0, 6)}...`}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="p-3 border-b border-gray-700">
                          <p className="text-white text-sm font-medium">{user.name}</p>
                          <p className="text-gray-400 text-xs font-mono">{user.address.slice(0, 6)}...</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            href="/profile"
                            className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md text-sm transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Not logged in
              <Link href="/login" className="hidden md:flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </Link>
              
              {user ? (
                // Mobile user actions
                <>
                  {isCorporateUser ? (
                    // Corporate User - Offers Button
                    <Link href="/my-offers" className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300 w-fit">
                      <Tag className="w-4 h-4" />
                      Offers
                    </Link>
                  ) : (
                    // Regular User - Create Contract Button
                    <Link href="/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300 w-fit">
                      <Plus className="w-4 h-4" />
                      Create Contract
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-fit"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                // Mobile Connect Wallet
                <Link href="/login" className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300 w-fit">
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}