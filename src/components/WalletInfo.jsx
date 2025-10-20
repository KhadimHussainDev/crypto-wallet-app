import React, { useState } from 'react';
import { Copy, ExternalLink, RefreshCw, Send, MessageSquare, Network } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletInfo = () => {
  const { 
    address, 
    balance, 
    network, 
    updateBalance, 
    disconnectWallet,
    sendTransaction,
    signMessage,
    fetchAllBalances,
    isLoading 
  } = useWallet();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSignForm, setShowSignForm] = useState(false);
  const [transactionData, setTransactionData] = useState({
    to: '',
    value: '',
    gasLimit: '21000'
  });
  const [messageToSign, setMessageToSign] = useState('');
  const [txHash, setTxHash] = useState('');
  const [signature, setSignature] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    try {
      const tx = {
        to: transactionData.to,
        value: transactionData.value,
        gasLimit: transactionData.gasLimit
      };
      
      const hash = await sendTransaction(tx);
      setTxHash(hash);
      setTransactionData({ to: '', value: '', gasLimit: '21000' });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const handleSignMessage = async (e) => {
    e.preventDefault();
    try {
      const sig = await signMessage(messageToSign);
      setSignature(sig);
      setMessageToSign('');
    } catch (error) {
      console.error('Message signing failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Wallet Information</h2>
        <button
          onClick={disconnectWallet}
          className="btn-secondary"
        >
          Disconnect
        </button>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <span className="font-mono text-sm flex-1">{formatAddress(address)}</span>
          <button
            onClick={() => copyToClipboard(address)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Copy address"
          >
            <Copy className="w-4 h-4" />
          </button>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-200 rounded"
            title="View on Etherscan"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Balance</label>
          <button
            onClick={updateBalance}
            disabled={isLoading}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-lg font-semibold">{balance || '0'} ETH</span>
        </div>
      </div>

      {/* Network */}
      {network && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Network className="w-4 h-4" />
            <span>{network.name} (Chain ID: {network.chainId})</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Send Transaction</span>
        </button>
        <button
          onClick={() => setShowSignForm(!showSignForm)}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Sign Message</span>
        </button>
        <button
          onClick={fetchAllBalances}
          disabled={isLoading}
          className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
          title="Fetch all available balances and print to console"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>All Balances</span>
        </button>
      </div>

      {/* Transaction Form */}
      {showTransactionForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Send Transaction</h3>
          <form onSubmit={handleSendTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Address</label>
              <input
                type="text"
                value={transactionData.to}
                onChange={(e) => setTransactionData({...transactionData, to: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
              <input
                type="text"
                value={transactionData.value}
                onChange={(e) => setTransactionData({...transactionData, value: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gas Limit</label>
              <input
                type="text"
                value={transactionData.gasLimit}
                onChange={(e) => setTransactionData({...transactionData, gasLimit: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Transaction'}
            </button>
          </form>
          {txHash && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Transaction sent! Hash: 
                <a 
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono ml-1 underline"
                >
                  {formatAddress(txHash)}
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sign Message Form */}
      {showSignForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Sign Message</h3>
          <form onSubmit={handleSignMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={messageToSign}
                onChange={(e) => setMessageToSign(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                placeholder="Enter message to sign..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Signing...' : 'Sign Message'}
            </button>
          </form>
          {signature && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Signature: 
                <span className="font-mono ml-1 break-all">{signature}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
