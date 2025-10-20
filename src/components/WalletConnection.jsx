import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { SUPPORTED_WALLETS, getAllWallets } from '../lib/walletAdapters';
import WalletCard from './WalletCard';
import WalletInfo from './WalletInfo';

const WalletConnection = () => {
  const { 
    isConnected, 
    connectWallet, 
    isLoading, 
    error, 
    clearError 
  } = useWallet();

  const allWallets = getAllWallets();

  const handleConnectWallet = async (walletType) => {
    clearError();
    await connectWallet(walletType);
  };

  const getWalletTypeFromName = (name) => {
    const nameMap = {
      'TrustWallet': SUPPORTED_WALLETS.TRUST_WALLET,
      'MetaMask': SUPPORTED_WALLETS.METAMASK,
      'Phantom': SUPPORTED_WALLETS.PHANTOM,
      'Coinbase Wallet': SUPPORTED_WALLETS.COINBASE,
      'TokenPocket': SUPPORTED_WALLETS.TOKEN_POCKET
    };
    return nameMap[name] || name.toLowerCase();
  };

  if (isConnected) {
    return <WalletInfo />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Choose a wallet to connect and start interacting with the blockchain
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Show all wallets */}
        {allWallets.map((wallet, index) => (
          <WalletCard
            key={index}
            wallet={wallet}
            isConnected={false}
            onConnect={() => handleConnectWallet(getWalletTypeFromName(wallet.name))}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">How to connect:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Make sure you have your preferred wallet extension installed</li>
          <li>2. Click on the wallet card above</li>
          <li>3. Approve the connection in your wallet</li>
          <li>4. Start using the wallet features!</li>
        </ol>
        
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Supported Networks:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div>• Ethereum Mainnet</div>
            <div>• Polygon</div>
            <div>• Binance Smart Chain</div>
            <div>• Solana (Phantom)</div>
            <div>• Avalanche</div>
            <div>• Fantom</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
