import React from 'react';
import { Wallet, CheckCircle } from 'lucide-react';

const WalletCard = ({ wallet, isConnected, onConnect, isLoading }) => {
  const handleClick = () => {
    if (!isConnected && !isLoading) {
      onConnect();
    }
  };

  return (
    <div 
      className={`wallet-card ${isConnected ? 'ring-2 ring-green-500' : ''} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{wallet.name}</h3>
            <p className="text-sm text-gray-500">
              {wallet.isAvailable() ? 'Available' : 'Not installed'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          {isLoading && (
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
      
      {!wallet.isAvailable() && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {wallet.name} is not installed. Please install the wallet extension to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
