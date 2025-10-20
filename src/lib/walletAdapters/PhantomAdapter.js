import { BaseWalletAdapter } from './BaseWalletAdapter.js';

/**
 * Phantom wallet adapter implementation
 * Phantom is a popular Solana wallet with some Ethereum support
 */
export class PhantomAdapter extends BaseWalletAdapter {
  constructor() {
    super('Phantom', '/icons/phantom.svg');
    this.isEthereum = false; // Phantom is primarily Solana-based
  }

  isAvailable() {
    return typeof window !== 'undefined' && 
           window.phantom && 
           window.phantom.solana;
  }

  async connect() {
    try {
      if (!this.isAvailable()) {
        throw new Error('Phantom wallet is not installed. Please install Phantom extension.');
      }

      // Connect to Phantom
      const response = await window.phantom.solana.connect();
      
      if (!response.publicKey) {
        throw new Error('Failed to connect to Phantom wallet.');
      }

      this.provider = window.phantom.solana;
      this.address = response.publicKey.toString();
      this.connected = true;

      // Listen for account changes
      window.phantom.solana.on('accountChanged', (publicKey) => {
        if (publicKey) {
          this.address = publicKey.toString();
        } else {
          this.disconnect();
        }
      });

      // Listen for disconnect
      window.phantom.solana.on('disconnect', () => {
        this.disconnect();
      });

      // Log connection details
      await this.logConnectionDetails();

      return {
        address: this.address,
        provider: this.provider
      };
    } catch (error) {
      console.error('Phantom connection error:', error);
      throw error;
    }
  }

  getSupportedCurrencies() {
    return [
      { symbol: 'SOL', name: 'Solana', network: 'Solana' },
      { symbol: 'USDC', name: 'USD Coin', network: 'Solana' },
      { symbol: 'USDT', name: 'Tether', network: 'Solana' },
      { symbol: 'RAY', name: 'Raydium', network: 'Solana' },
      { symbol: 'SRM', name: 'Serum', network: 'Solana' },
      { symbol: 'COPE', name: 'Cope', network: 'Solana' },
      { symbol: 'STEP', name: 'Step Finance', network: 'Solana' },
      { symbol: 'FIDA', name: 'Bonfida', network: 'Solana' }
    ];
  }

  async disconnect() {
    try {
      if (this.provider && this.provider.disconnect) {
        await this.provider.disconnect();
      }
    } catch (error) {
      console.error('Phantom disconnect error:', error);
    }
    await super.disconnect();
  }

  async getBalance() {
    if (!this.connected || !this.provider || !this.address) {
      throw new Error('Wallet not connected');
    }

    try {
      // Get SOL balance
      const balance = await this.provider.getBalance(this.address);
      return (balance / 1000000000).toString(); // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      // Return 0 if balance fetch fails
      return '0';
    }
  }

  async sendTransaction(transaction) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      // For Solana transactions, we need to handle differently
      // This is a simplified implementation
      const { signature } = await this.provider.signAndSendTransaction(transaction);
      return signature;
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
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await this.provider.signMessage(encodedMessage, 'utf8');
      return signedMessage.signature;
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
      // Phantom typically connects to Solana mainnet
      return {
        chainId: 'solana-mainnet',
        name: 'Solana Mainnet'
      };
    } catch (error) {
      console.error('Error getting network:', error);
      throw error;
    }
  }

  async switchNetwork(network) {
    // Phantom doesn't support network switching in the same way as Ethereum wallets
    throw new Error('Network switching not supported by Phantom wallet');
  }

  // Phantom-specific methods
  async signTransaction(transaction) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTransaction = await this.provider.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  async signAllTransactions(transactions) {
    if (!this.connected || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTransactions = await this.provider.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      console.error('Error signing transactions:', error);
      throw error;
    }
  }
}
