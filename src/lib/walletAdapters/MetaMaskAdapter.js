import { BaseWalletAdapter } from './BaseWalletAdapter.js';
import { ethers } from 'ethers';

/**
 * MetaMask wallet adapter implementation
 * MetaMask is the most popular Ethereum wallet extension
 */
export class MetaMaskAdapter extends BaseWalletAdapter {
  constructor() {
    super('MetaMask', '/icons/metamask.svg');
  }

  isAvailable() {
    return typeof window !== 'undefined' && 
           window.ethereum && 
           window.ethereum.isMetaMask && 
           !window.ethereum.isTrust && 
           !window.ethereum.isTrustWallet &&
           !window.ethereum.isTokenPocket &&
           !window.ethereum.isCoinbaseWallet;
  }

  async connect() {
    try {
      if (!this.isAvailable()) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
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
      console.error('MetaMask connection error:', error);
      throw error;
    }
  }

  getSupportedCurrencies() {
    return [
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
      { symbol: 'MATIC', name: 'Polygon', network: 'Polygon' },
      { symbol: 'BNB', name: 'Binance Coin', network: 'BSC' },
      { symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche' },
      { symbol: 'FTM', name: 'Fantom', network: 'Fantom' },
      { symbol: 'USDT', name: 'Tether', network: 'Multi-chain' },
      { symbol: 'USDC', name: 'USD Coin', network: 'Multi-chain' },
      { symbol: 'DAI', name: 'Dai Stablecoin', network: 'Ethereum' },
      { symbol: 'WETH', name: 'Wrapped Ethereum', network: 'Multi-chain' }
    ];
  }

  async getTokenBalance(tokenAddress, symbol) {
    if (!this.connected || !this.provider || !this.address) {
      throw new Error('Wallet not connected');
    }

    // If it's a native token, return the native balance
    if (this.isPrimaryCurrency(symbol)) {
      return await this.getBalance();
    }

    // If no token address provided, return 0
    if (!tokenAddress) {
      return '0';
    }

    try {
      // ERC-20 token balance check
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ],
        this.provider
      );

      const balance = await tokenContract.balanceOf(this.address);
      const decimals = await tokenContract.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.warn(`Failed to fetch ${symbol} balance:`, error.message);
      return '0';
    }
  }

  async disconnect() {
    await super.disconnect();
    // Note: We can't programmatically disconnect from MetaMask
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
      }
    };

    const config = networkConfigs[chainId];
    if (config) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [config]
      });
    }
  }
}
