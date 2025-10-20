import { BaseWalletAdapter } from './BaseWalletAdapter.js';
import { ethers } from 'ethers';

/**
 * Coinbase Wallet adapter implementation
 * Coinbase Wallet is a user-friendly Ethereum wallet
 */
export class CoinbaseWalletAdapter extends BaseWalletAdapter {
  constructor() {
    super('Coinbase Wallet', '/icons/coinbase.svg');
  }

  isAvailable() {
    return typeof window !== 'undefined' && 
           ((window.ethereum && window.ethereum.isCoinbaseWallet) ||
            (window.coinbaseWalletExtension));
  }

  async connect() {
    try {
      if (!this.isAvailable()) {
        throw new Error('Coinbase Wallet is not installed. Please install Coinbase Wallet extension.');
      }

      // Get the Coinbase provider
      let provider = null;
      if (window.ethereum && window.ethereum.isCoinbaseWallet) {
        provider = window.ethereum;
      } else if (window.coinbaseWalletExtension) {
        provider = window.coinbaseWalletExtension;
      }

      if (!provider) {
        throw new Error('Coinbase Wallet provider not found.');
      }

      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure Coinbase Wallet is unlocked.');
      }

      // Create ethers provider
      this.provider = new ethers.BrowserProvider(provider);
      this.address = accounts[0];
      this.connected = true;

      // Listen for account changes
      provider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.address = accounts[0];
        }
      });

      // Listen for network changes
      provider.on('chainChanged', () => {
        window.location.reload();
      });

      // Log connection details
      await this.logConnectionDetails();

      return {
        address: this.address,
        provider: this.provider
      };
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error);
      throw error;
    }
  }

  getSupportedCurrencies() {
    return [
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
      { symbol: 'USDC', name: 'USD Coin', network: 'Multi-chain' },
      { symbol: 'USDT', name: 'Tether', network: 'Multi-chain' },
      { symbol: 'DAI', name: 'Dai Stablecoin', network: 'Ethereum' },
      { symbol: 'WETH', name: 'Wrapped Ethereum', network: 'Multi-chain' },
      { symbol: 'MATIC', name: 'Polygon', network: 'Polygon' },
      { symbol: 'UNI', name: 'Uniswap', network: 'Ethereum' },
      { symbol: 'LINK', name: 'Chainlink', network: 'Ethereum' },
      { symbol: 'COMP', name: 'Compound', network: 'Ethereum' }
    ];
  }

  async disconnect() {
    await super.disconnect();
    // Note: Coinbase Wallet doesn't support programmatic disconnect
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
      const provider = window.ethereum && window.ethereum.isCoinbaseWallet 
        ? window.ethereum 
        : window.coinbaseWalletExtension;

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        console.error('Error switching network:', error);
        throw error;
      }
    }
  }

  async addNetwork(chainId) {
    const networkConfigs = {
      137: { // Polygon
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      56: { // BSC
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/']
      },
      10: { // Optimism
        chainId: '0xa',
        chainName: 'Optimism',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.optimism.io/'],
        blockExplorerUrls: ['https://optimistic.etherscan.io/']
      },
      42161: { // Arbitrum
        chainId: '0xa4b1',
        chainName: 'Arbitrum One',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/']
      }
    };

    const config = networkConfigs[chainId];
    if (config) {
      const provider = window.ethereum && window.ethereum.isCoinbaseWallet 
        ? window.ethereum 
        : window.coinbaseWalletExtension;

      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [config]
      });
    }
  }

  // Coinbase Wallet specific methods
  async requestPermissions() {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = window.ethereum && window.ethereum.isCoinbaseWallet 
        ? window.ethereum 
        : window.coinbaseWalletExtension;

      return await provider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
    } catch (error) {
      console.error('Error requesting permissions:', error);
      throw error;
    }
  }
}
