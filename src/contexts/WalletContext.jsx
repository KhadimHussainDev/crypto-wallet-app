import React, { createContext, useContext, useState, useEffect } from 'react';
import { createWalletAdapter, getAvailableWallets, getAllWallets } from '../lib/walletAdapters';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableWallets, setAvailableWallets] = useState([]);

  // Initialize available wallets on mount
  useEffect(() => {
    const wallets = getAvailableWallets();
    setAvailableWallets(wallets);
  }, []);

  // Connect to a wallet
  const connectWallet = async (walletType) => {
    setIsLoading(true);
    setError(null);

    try {
      const walletAdapter = createWalletAdapter(walletType);
      const { address: walletAddress, provider } = await walletAdapter.connect();

      setCurrentWallet(walletAdapter);
      setIsConnected(true);
      setAddress(walletAddress);

      // Get initial balance and network info
      await Promise.all([
        updateBalance(walletAdapter),
        updateNetwork(walletAdapter)
      ]);

    } catch (err) {
      setError(err.message);
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect from current wallet
  const disconnectWallet = async () => {
    if (currentWallet) {
      try {
        await currentWallet.disconnect();
      } catch (err) {
        console.error('Disconnect error:', err);
      }
    }

    setCurrentWallet(null);
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    setNetwork(null);
    setError(null);
  };

  // Update wallet balance
  const updateBalance = async (wallet = currentWallet) => {
    if (!wallet || !wallet.connected) return;

    try {
      const walletBalance = await wallet.getBalance();
      setBalance(walletBalance);
    } catch (err) {
      console.error('Error updating balance:', err);
      setError('Failed to fetch balance');
    }
  };

  // Update network information
  const updateNetwork = async (wallet = currentWallet) => {
    if (!wallet || !wallet.connected) return;

    try {
      const networkInfo = await wallet.getNetwork();
      setNetwork(networkInfo);
    } catch (err) {
      console.error('Error updating network:', err);
      setError('Failed to fetch network info');
    }
  };

  // Send transaction
  const sendTransaction = async (transaction) => {
    if (!currentWallet || !isConnected) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const txHash = await currentWallet.sendTransaction(transaction);
      
      // Update balance after transaction
      setTimeout(() => updateBalance(), 2000);
      
      return txHash;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign message
  const signMessage = async (message) => {
    if (!currentWallet || !isConnected) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signature = await currentWallet.signMessage(message);
      return signature;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Switch network (if supported)
  const switchNetwork = async (chainId) => {
    if (!currentWallet || !isConnected) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      if (currentWallet.switchNetwork) {
        await currentWallet.switchNetwork(chainId);
        await updateNetwork();
      } else {
        throw new Error('Network switching not supported by this wallet');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all available balances
  const fetchAllBalances = async () => {
    if (!currentWallet || !isConnected) {
      console.error('No wallet connected');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Manually fetching all balances...');
      const balances = await currentWallet.getAllBalances();
      console.log('✅ Balance fetch complete!');
      return balances;
    } catch (err) {
      console.error('❌ Failed to fetch all balances:', err);
      setError('Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // State
    currentWallet,
    isConnected,
    address,
    balance,
    network,
    isLoading,
    error,
    availableWallets,

    // Actions
    connectWallet,
    disconnectWallet,
    updateBalance,
    updateNetwork,
    sendTransaction,
    signMessage,
    switchNetwork,
    fetchAllBalances,
    
    // Utilities
    clearError: () => setError(null)
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
