import { BaseWalletAdapter } from './BaseWalletAdapter.js';
import { ethers } from 'ethers';

/**
 * TrustWallet adapter implementation
 * TrustWallet uses the same interface as MetaMask (window.ethereum)
 */
export class TrustWalletAdapter extends BaseWalletAdapter {
  constructor() {
    super('TrustWallet', '/icons/trustwallet.svg');
  }

  isAvailable() {
    // TrustWallet injects ethereum provider similar to MetaMask
    // We can detect TrustWallet by checking for specific properties
    return typeof window !== 'undefined' && 
           window.ethereum && 
           (window.ethereum.isTrust || window.ethereum.isTrustWallet) &&
           !window.ethereum.isTokenPocket; // TokenPocket might also set isTrust
  }

  async connect() {
    try {
      if (!this.isAvailable()) {
        throw new Error('TrustWallet is not installed. Please install TrustWallet extension.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure TrustWallet is unlocked.');
      }

      // Create ethers provider
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.address = accounts[0];
      this.connected = true;

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.address = accounts[0];
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      // Log connection details
      await this.logConnectionDetails();

      return {
        address: this.address,
        provider: this.provider
      };
    } catch (error) {
      console.error('TrustWallet connection error:', error);
      throw error;
    }
  }

  getSupportedCurrencies() {
    return [
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
      { symbol: 'BNB', name: 'Binance Coin', network: 'BSC' },
      { symbol: 'USDT', name: 'Tether', network: 'Multi-chain' },
      { symbol: 'USDC', name: 'USD Coin', network: 'Multi-chain' },
      { symbol: 'BUSD', name: 'Binance USD', network: 'BSC' },
      { symbol: 'MATIC', name: 'Polygon', network: 'Polygon' },
      { symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche' },
      { symbol: 'FTM', name: 'Fantom', network: 'Fantom' }
    ];
  }

  async disconnect() {
    await super.disconnect();
    // Note: We can't programmatically disconnect from TrustWallet
    // User needs to disconnect manually from the wallet
  }

  async getBalance() {
    if (!this.connected || !this.provider || !this.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.provider.getBalance(this.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async sendTransaction(transaction) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = await this.provider.getSigner();
      const tx = await signer.sendTransaction(transaction);
      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async signMessage(message) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = await this.provider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  async getNetwork() {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: network.chainId.toString(),
        name: network.name
      };
    } catch (error) {
      console.error('Error getting network:', error);
      throw error;
    }
  }

  async switchNetwork(chainId) {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }
}
