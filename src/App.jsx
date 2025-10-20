import React from 'react';
import { WalletProvider } from './contexts/WalletContext';
import WalletConnection from './components/WalletConnection';
import { Wallet, Github, ExternalLink } from 'lucide-react';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Crypto Wallet Hub</h1>
                  <p className="text-sm text-gray-500">Connect & Manage Your Crypto Wallets</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View on GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://docs.ethers.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Documentation"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Crypto Wallet Hub
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A modern, secure, and extensible platform for connecting to multiple cryptocurrency wallets. 
              Support for TrustWallet, MetaMask, Phantom, Coinbase Wallet, and TokenPocket.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Wallet Support</h3>
              <p className="text-gray-600 text-sm">
                Connect to TrustWallet, MetaMask, Phantom, Coinbase Wallet, and TokenPocket.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-gray-600 text-sm">
                Send transactions and sign messages with full user control and approval.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Balance</h3>
              <p className="text-gray-600 text-sm">
                View your wallet balance and network information in real-time.
              </p>
            </div>
          </div>

          {/* Wallet Connection Component */}
          <WalletConnection />

          {/* Technical Info */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Built With</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React 18 with modern hooks</li>
                  <li>• Ethers.js for blockchain interaction</li>
                  <li>• TailwindCSS for styling</li>
                  <li>• Modular wallet adapter architecture</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Supported Wallets</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• TrustWallet (Ethereum/BSC)</li>
                  <li>• MetaMask (Multi-chain)</li>
                  <li>• Phantom (Solana)</li>
                  <li>• Coinbase Wallet (Ethereum)</li>
                  <li>• TokenPocket (Multi-chain)</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2024 Crypto Wallet Hub. Built with React and Ethers.js</p>
              <p className="mt-2">
                Extensible architecture designed for easy integration of multiple wallet providers.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
