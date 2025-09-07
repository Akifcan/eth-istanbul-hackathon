import { Github, Twitter, Linkedin, Mail, Shield, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Sway
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Web3-based platform enabling users to purchase products in bulk at lower prices through blockchain technology and smart contracts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link href="/how-it-works" className="block text-gray-400 hover:text-white transition-colors text-sm">
                How It Works
              </Link>
              <Link href="/faq" className="block text-gray-400 hover:text-white transition-colors text-sm">
                FAQ
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Sway. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Powered by Web3</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Blockchain Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}