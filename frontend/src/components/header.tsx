'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart, User, Search, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            {/* Connect Wallet Button */}
            <Link href="/login" className="hidden md:flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Link>

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
              
              {/* Mobile Connect Wallet */}
              <Link href="/login" className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300 w-fit">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}