import { BaseWalletAdapter } from './BaseWalletAdapter.js';
import { ethers } from 'ethers';

/**
 * TokenPocket wallet adapter implementation
 * TokenPocket is a multi-chain wallet supporting various blockchains
 */
export class TokenPocketAdapter extends BaseWalletAdapter {
  constructor() {
    super('TokenPocket', '/icons/tokenpocket.svg');
  }

  isAvailable() {
    return typeof window !== 'undefined' && 
           ((window.ethereum && window.ethereum.isTokenPocket) ||
            (window.tokenpocket && window.tokenpocket.ethereum) ||
            (window.ethereum && window.ethereum.isTP)); // Some versions use isTP
  }

  async connect() {
    try {
      if (!this.isAvailable()) {
        throw new Error('TokenPocket is not installed. Please install TokenPocket extension.');
      }

      // Get the TokenPocket provider
      let provider = null;
      if (window.ethereum && window.ethereum.isTokenPocket) {
        provider = window.ethereum;
      } else if (window.tokenpocket && window.tokenpocket.ethereum) {
        provider = window.tokenpocket.ethereum;
      }

      if (!provider) {
        throw new Error('TokenPocket provider not found.');
      }

      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure TokenPocket is unlocked.');
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
      console.error('TokenPocket connection error:', error);
      throw error;
    }
  }

  getSupportedCurrencies() {
    return [
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
      { symbol: 'BNB', name: 'Binance Coin', network: 'BSC' },
      { symbol: 'MATIC', name: 'Polygon', network: 'Polygon' },
      { symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche' },
      { symbol: 'FTM', name: 'Fantom', network: 'Fantom' },
      { symbol: 'HT', name: 'Huobi Token', network: 'HECO' },
      { symbol: 'TRX', name: 'Tron', network: 'Tron' },
      { symbol: 'USDT', name: 'Tether', network: 'Multi-chain' },
      { symbol: 'USDC', name: 'USD Coin', network: 'Multi-chain' },
      { symbol: 'BUSD', name: 'Binance USD', network: 'BSC' },
      { symbol: 'CAKE', name: 'PancakeSwap', network: 'BSC' },
      { symbol: 'UNI', name: 'Uniswap', network: 'Ethereum' }
    ];
  }

  async disconnect() {
    await super.disconnect();
    // Note: TokenPocket doesn't support programmatic disconnect
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
      const provider = window.ethereum && window.ethereum.isTokenPocket 
        ? window.ethereum 
        : window.tokenpocket.ethereum;

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
      43114: { // Avalanche
        chainId: '0xa86a',
        chainName: 'Avalanche Network',
        nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://snowtrace.io/']
      },
      250: { // Fantom
        chainId: '0xfa',
        chainName: 'Fantom Opera',
        nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
        rpcUrls: ['https://rpc.ftm.tools/'],
        blockExplorerUrls: ['https://ftmscan.com/']
      },
      128: { // HECO
        chainId: '0x80',
        chainName: 'Huobi ECO Chain',
        nativeCurrency: { name: 'HT', symbol: 'HT', decimals: 18 },
        rpcUrls: ['https://http-mainnet.hecochain.com'],
        blockExplorerUrls: ['https://hecoinfo.com/']
      }
    };

    const config = networkConfigs[chainId];
    if (config) {
      const provider = window.ethereum && window.ethereum.isTokenPocket 
        ? window.ethereum 
        : window.tokenpocket.ethereum;

      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [config]
      });
    }
  }

  // TokenPocket specific methods
  async getChainList() {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = window.ethereum && window.ethereum.isTokenPocket 
        ? window.ethereum 
        : window.tokenpocket.ethereum;

      // TokenPocket supports multiple chains
      return await provider.request({
        method: 'tp_getChainList'
      });
    } catch (error) {
      console.error('Error getting chain list:', error);
      // Return empty array if not supported
      return [];
    }
  }

  async switchChain(chainName) {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = window.ethereum && window.ethereum.isTokenPocket 
        ? window.ethereum 
        : window.tokenpocket.ethereum;

      return await provider.request({
        method: 'tp_switchChain',
        params: [chainName]
      });
    } catch (error) {
      console.error('Error switching chain:', error);
      throw error;
    }
  }

  async getWalletInfo() {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = window.ethereum && window.ethereum.isTokenPocket 
        ? window.ethereum 
        : window.tokenpocket.ethereum;

      return await provider.request({
        method: 'tp_getWalletInfo'
      });
    } catch (error) {
      console.error('Error getting wallet info:', error);
      return null;
    }
  }
}
